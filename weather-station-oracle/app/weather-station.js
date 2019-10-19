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

/*****************************************************************************
 *                                  CONFIG                                   *
 *****************************************************************************/

// coin api key
const APIKEY = process.env.APIKEY;

// random delay
const WAIT_MIN = parseInt(process.env.WAIT_MIN) || 0; // in ms
const WAIT_MAX = parseInt(process.env.WAIT_MAX) || 0; // in ms

/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/

let [ lat, lon, time ] = process.argv.slice(2);

const unit = 'si';

/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/
let path = `/forecast/${APIKEY}/${lat},${lon},${time}?exclude=minutely,hourly,daily,alerts&units=${unit}`;

const query = {
	method: 'GET',
	port:   443,
	host:   'api.darksky.net',
	path:   path,
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

	let { latitude, longitude } = results;
	let { time, icon } = results.currently;

	let location = `${latitude},${longitude}`;

	if (isNaN(time) || icon == undefined)
	{
		throw new Error("invalid results");
	}

	let iexeccallback = ethers.utils.defaultAbiCoder.encode(['uint256', 'string', 'string'], [time, location, icon]);
	let iexecconsensus = ethers.utils.keccak256(iexeccallback);
	fs.writeFile(callbackFilePath,    iexeccallback , (err) => {});
	fs.writeFile(determinismFilePath, iexecconsensus, (err) => {});

	console.log(`- Success: ${time} ${icon}`);
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