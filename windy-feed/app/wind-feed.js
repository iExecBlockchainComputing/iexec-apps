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
//const APIKEY = 'KXsaxepCiFoAlxKXkLzDO5sIbuLojtjH';
const APIKEY1 = '4a71fa5207ec7e06042f7e63a647a80b';
// const APIKEY = '69CC0AA9-1E4D-4E41-806F-8C3642729B88';
// const APIKEY = 'D2C881D6-0BBF-4EFE-A572-AE6DB379D43E';
// const APIKEY = 'FB7B2516-70A1-42D8-8702-292F29F19768';


// random delay
const WAIT_MIN = parseInt(process.env.WAIT_MIN) || 0; // in ms
const WAIT_MAX = parseInt(process.env.WAIT_MAX) || 0; // in ms

/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/
var [lat, long ] = process.argv.slice(2);


/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/


var lat = lat || 37.39;
var long = long || -122.08;


const url = "https://api.openweathermap.org/data/2.5/weather";
const query1 = `${url}?lat=${lat}&lon=${long}&appid=${APIKEY1}`;

/*****************************************************************************
 *                                  EXECUTE                                  *
 *****************************************************************************/

new Promise(async (resolve, reject) => {

	const delay = (WAIT_MAX-WAIT_MIN) * Math.random() + WAIT_MIN;
	console.log(`- Waiting for ${delay} ms.`);
	await sleep(delay);

	console.log(query);
	let chunks = [];
	let request = https.get(query1, res => {
		res.setEncoding('utf8');
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
	console.log("Inside " + data)
	let results = JSON.parse(data.toString());
	console.log("\n\n");
	console.dir(results)
	if (results.error !== undefined)
	{
		throw new Error(results.error);
	}

	let timestamp = undefined;
	let details   = undefined;
    let speed     = undefined;
    let deg       = undefined;



	var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (1000 * results.timezone));


	timestamp = nd.getTime();
	console.log(results.wind.speed +" ," + " " +  results.wind.deg);
	var speed   = results.wind.speed;
	var deg = results.wind.deg;
	var details = lat + long;
	//value     = Math.round(results.rate * 10**power);
		

	if (isNaN(timestamp) || results.wind.speed === undefined)
	{
		throw new Error("invalid results");
	}

	var iexeccallback = ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256', 'uint256', 'string'], [timestamp, speed, deg, details]);
	var iexecconsensus = ethers.utils.keccak256(iexeccallback);
	fs.writeFile(callbackFilePath,    iexeccallback , (err) => {});
	fs.writeFile(determinismFilePath, iexecconsensus, (err) => {});

	console.log(`- Success: ${timestamp} ${details}`);
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