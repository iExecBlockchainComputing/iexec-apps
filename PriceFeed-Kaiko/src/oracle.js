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
// const EXCHANGE = 'cbse'
const EXCHANGE = 'bnce'
const APIKEY   = '';

const WAIT_MIN = parseInt(process.env.WAIT_MIN) || 0; // in ms
const WAIT_MAX = parseInt(process.env.WAIT_MAX) || 0; // in ms

/*****************************************************************************
 *                                   TOOLS                                   *
 *****************************************************************************/
process.sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

Math.average = (input) => {
	this.output = 0;
	for (this.i = 0; this.i < input.length; ++this.i)
	{
		this.output+=Number(input[this.i]);
	}
	return this.output/input.length;
}

/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/

var [ asset_id_base, asset_id_quote, power, time ] = process.argv.slice(2);
if (/^\d*$/.test(time)) { time = new Date(parseInt(time)*1000).toISOString(); }

// const asset_id_base  = "BTC"
// const asset_id_quote = "USD"
// const power          = 9
// const time           = new Date().toISOString();

/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/

const fragment = Object.entries({
	// 'interval': '1m',
	'start_time': time,
}).filter(([k,v]) => v).map(([k,v]) => `${k}=${v}`).join('&');

const query = {
	method: 'GET',
	port: 443,
	host: 'eu.market-api.kaiko.io',
	// path: `/v1/data/trades.v1/exchanges/${EXCHANGE}/spot/${asset_id_base}-${asset_id_quote}/aggregations/vwap?${fragment}`,
	path: `/v1/data/trades.v1/exchanges/${EXCHANGE}/spot/${asset_id_base}-${asset_id_quote}/trades?${fragment}`,
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
	await process.sleep(delay);

	console.log('- Calling API');
	var data = "";
	var request = https.request(query, res => {
		res.on('data', (chunk) => {
			data += chunk;
		});
		res.on('end', () => {
			if (data)
			{
				console.log('- Got data');
				resolve(data);
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

	var timestamp = new Date(results.query.start_time).getTime();
	var details   = [ results.query.instrument, power].join('-').toUpperCase();
	var value     = Math.round(Math.average(results.data.map(t => t.price)) * 10**power);

	if (isNaN(timestamp) || isNaN(value) || results.asset_id_base  == "" || results.asset_id_quote == "")
	{
		throw new Error("Error: invalid results " + JSON.stringify({query, results}));
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
