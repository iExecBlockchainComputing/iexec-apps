const https   = require('https');
const ethers  = require('ethers');
const fs      = require('fs');

const root                = 'iexec_out';
const determinismFilePath = `${root}/determinism.iexec`;
const callbackFilePath    = `${root}/callback.iexec`;
const errorFilePath       = `${root}/error.iexec`;

/*****************************************************************************
 *                                  CONFIG                                   *
 *****************************************************************************/

// kaiko api key
const APIKEY   = '';

// version 0
const VERSION = 0;
const EXCHANGE = 'bnce'
// const EXCHANGE = 'cbse'

// random delay
const WAIT_MIN = parseInt(process.env.WAIT_MIN) || 0; // in ms
const WAIT_MAX = parseInt(process.env.WAIT_MAX) || 0; // in ms

/*****************************************************************************
 *                                   TOOLS                                   *
 *****************************************************************************/
const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/

var [ asset_id_base, asset_id_quote, power, time ] = process.argv.slice(2);

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
			'start_time': time,
		}).filter(([k,v]) => v).map(([k,v]) => `${k}=${v}`).join('&');
		path = `/v1/data/trades.v1/exchanges/${EXCHANGE}/spot/${asset_id_base}-${asset_id_quote}/trades?${fragment}`;
		break;
	}
}

const query = {
	method: 'GET',
	port:   443,
	host:   'eu.market-api.kaiko.io',
	path:   path,
	headers: {
		'Accept': 'application/json',
		'X-Api-Key': process.env.APIKEY || APIKEY,
	},
};

/*****************************************************************************
 *                                  EXECUTE                                  *
 *****************************************************************************/
new Promise(async (resolve, reject) => {

	const delay = (WAIT_MAX-WAIT_MIN) * Math.random() + WAIT_MIN;
	console.log(`- Waiting for ${delay} ms.`);
	await sleep(delay);

	console.log('- Calling API');
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
	var results = JSON.parse(data.toString());

	if (results.result !== 'success')
	{
		throw new Error(results.message);
	}

	let timestamp = undefined;
	let details   = undefined;
	let value     = undefined;

	switch (VERSION)
	{
		case 0:
		{
			timestamp = new Date(results.query.start_time).getTime();
			details   = [ results.query.instrument, power].join('-').toUpperCase();
			value     = Math.round(Math.average(results.data.map(t => t.price)) * 10**power);
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
