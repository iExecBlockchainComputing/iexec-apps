const https   = require('https');
const ethers  = require('ethers');
const fs      = require('fs');

const root                = 'iexec_out';
const determinismFilePath = `${root}/determinism.iexec`;
const callbackFilePath    = `${root}/callback.iexec`;
const errorFilePath       = `${root}/error.iexec`;


/*****************************************************************************
 *                                   TOOLS                                   *
 *****************************************************************************/
const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const cat = (path) => {
	try { return fs.readFileSync(path).toString(); } catch (e) { return null; }
}

/*****************************************************************************
 *                                  CONFIG                                   *
 *****************************************************************************/

// coin api key
const APIKEY = '65FFBB07-6119-4A1E-80DC-F46B4FF9EE2F';
// const APIKEY = '69CC0AA9-1E4D-4E41-806F-8C3642729B88';
// const APIKEY = 'D2C881D6-0BBF-4EFE-A572-AE6DB379D43E';
// const APIKEY = 'FB7B2516-70A1-42D8-8702-292F29F19768';

// --- version 0: using an aggregate ---
const VERSION = 0;

// --- version 1: using trade history ---
// const VERSION = 1;
// const EXCHANGE = 'BITSTAMP';
// const EXCHANGE = 'BINANCE';

// random delay
const WAIT_MIN = parseInt(process.env.WAIT_MIN) || 0; // in ms
const WAIT_MAX = parseInt(process.env.WAIT_MAX) || 0; // in ms

/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/

var [ asset_id_base, asset_id_quote, power, time ] = process.argv.slice(2).map(s => s.toUpperCase());

if (/^\d*$/.test(time)) { time = new Date(parseInt(time)*1000); } // evm timestamp
else if (time)          { time = new Date(time);                } // any other format
else                    { time = new Date();                    } // not value → now

/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/
let path = undefined;

switch (VERSION)
{
	case 0:
	{
		const fragment = Object.entries({
			'time': time.toISOString(),
		}).filter(([k,v]) => v).map(([k,v]) => `${k}=${v}`).join('&');

		path = `/v1/exchangerate/${asset_id_base}/${asset_id_quote}?${fragment}`;
		break;
	}
	case 1:
	{
		const time_start = new Date(time.getTime() - 60*1000); // T - 60s
		const time_end   = new Date(time.getTime() +  0*1000); // T +  0s

		const fragment = Object.entries({
			'time_start': time_start.toISOString(),
			'time_end':   time_end.toISOString(),
		}).filter(([k,v]) => v).map(([k,v]) => `${k}=${v}`).join('&');

		path = `/v1/trades/${EXCHANGE}_SPOT_${asset_id_base}_${asset_id_quote}/history?${fragment}`;
		break;
	}
}

const query = {
	method: 'GET',
	port:   443,
	host:   'rest.coinapi.io',
	path:   path,
	headers: { 'X-CoinAPI-Key': cat(`/iexec_in/${process.env.IEXEC_DATASET_FILENAME}`) || APIKEY },
};

/*****************************************************************************
 *                                  EXECUTE                                  *
 *****************************************************************************/
new Promise(async (resolve, reject) => {

	const delay = (WAIT_MAX-WAIT_MIN) * Math.random() + WAIT_MIN;
	console.log(`- Waiting for ${delay} ms.`);
	await sleep(delay);

	console.log(`- Calling API ${query.host}${query.path}`);
	let chunks = [];
	let request = https.request(query, res => {
		res.on('data', (chunk) => {
			chunks.push(chunk);
		});
		res.on('end', () => {
			if (chunks.length)
			{
				resolve(chunks.join(''));
			}
			else
			{
				reject(`[HTTP ERROR]\nstatusCode: ${res.statusCode}`);
			}
		});
	});
	request.on('error', reject);
	request.end();
})
.then(data => {
	let results = JSON.parse(data.toString());

	if (results.error !== undefined)
	{
		throw new Error(results.error);
	}

	let timestamp = undefined;
	let details   = undefined;
	let value     = undefined;

	switch (VERSION)
	{
		case 0:
		{
			timestamp = new Date(results.time).getTime();
			details   = [ results.asset_id_base, results.asset_id_quote, power].join('-');
			value     = Math.round(results.rate * 10**power);
			break;
		}
		case 1:
		{
			if (results.length == 0)
			{
				throw new Error('missing data');
			}
			const average = ((w,v) => v/w)(...results.reduce((acc, trade) => [acc[0] + trade.size, acc[1] + trade.price * trade.size], [0,0]));
			timestamp = time.getTime();
			details   = [ asset_id_base, asset_id_quote, power].join('-');
			value     = Math.round(average * 10**power);
			break;
		}
	}

	if (isNaN(timestamp) || isNaN(value))
	{
		throw new Error("invalid results");
	}

	var iexeccallback = ethers.utils.defaultAbiCoder.encode(['uint256', 'string', 'uint256'], [timestamp, details, value]);
	var iexecconsensus = ethers.utils.keccak256(iexeccallback);
	fs.writeFile(callbackFilePath,    iexeccallback , (err) => {});
	fs.writeFile(determinismFilePath, iexecconsensus, (err) => {});

	console.log(`- Success: ${timestamp} ${details} ${value}`);
})
.catch(error => {
	fs.writeFile(
		errorFilePath,
		error.toString(),
		(err) => {}
	);
	fs.writeFile(
		determinismFilePath,
		ethers.utils.solidityKeccak256(['string'],[error.toString()]),
		(err) => {}
	);
	console.log(error.toString());
});
