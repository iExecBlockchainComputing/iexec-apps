const https   = require('https');
const ethers  = require('ethers');
const fs      = require('fs');

const root                = 'iexec_out';
const determinismFilePath = `${root}/determinism.iexec`;
const callbackFilePath    = `${root}/callback.iexec`;
const errorFilePath       = `${root}/error.iexec`;

<<<<<<< HEAD
// Type of activity status:
// I = In Transit
// D = Delivered
// X = Exception
// P = Pickup
// M = Manifest Pickup

const DeliveryStatus = {
	I : 1,
	D : 2,
	X : 3,
	P : 4,
	M : 5
}
=======
>>>>>>> dbad13c1e40309d9e9c9e3007b0f5e77f3a353ac

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

// UPS api key
const APIKEY = '7D6C7B558EF337F2';

// random delay
const WAIT_MIN = parseInt(process.env.WAIT_MIN) || 0; // in ms
const WAIT_MAX = parseInt(process.env.WAIT_MAX) || 0; // in ms

/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/

var [ UPS_username, UPS_password, trackingNumber ] = process.argv.slice(2);

/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/

const post_data = JSON.stringify({
	"UPSSecurity": {
		"UsernameToken": {
			"Username": UPS_username,
			"Password": UPS_password
		},
		"ServiceAccessToken": {
			"AccessLicenseNumber": APIKEY
		}
	},
	"TrackRequest": {
		"Request": {
			"RequestOption": "1",
			"TransactionReference": {
				"CustomerContext": "Your Test Case Summary Description"
			}
		},
		"InquiryNumber": trackingNumber
	}
	
});

const options = {
	method: 'POST',
	host:   'onlinetools.ups.com',
	path: '/rest/Track',
	headers: {'Content-Type': 'application/json', 'Content-Length': post_data.length},
};

/*****************************************************************************
 *                                  EXECUTE                                  *
 *****************************************************************************/
new Promise(async (resolve, reject) => {

	const delay = (WAIT_MAX-WAIT_MIN) * Math.random() + WAIT_MIN;
	console.log(`- Waiting for ${delay} ms.`);
	await sleep(delay);

	console.log(`making request`);
	let chunks = [];
	let request = https.request(options, res => {
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
	request.write(post_data);
	request.on('error', reject);
	request.end();
})
.then(data => {
	console.log("parsing JSON");
	let results = JSON.parse(data.toString());
	// console.log(results);

	if (results.Fault !== undefined)
	{
		console.log("error");
		throw new Error(JSON.stringify(results.Fault.detail));
	}
<<<<<<< HEAD
	// let deliveryStatus = results.TrackResponse.Shipment.Package.Activity[0].Status.Description;
	let deliveryStatus = DeliveryStatus[results.TrackResponse.Shipment.Package.Activity[0].Status.Type];

	var iexeccallback = ethers.utils.defaultAbiCoder.encode(['uint256'], [deliveryStatus]);
=======
	let deliveryStatus = results.TrackResponse.Shipment.Package.Activity[0].Status.Description;

	var iexeccallback = ethers.utils.defaultAbiCoder.encode(['string'], [deliveryStatus]);
>>>>>>> dbad13c1e40309d9e9c9e3007b0f5e77f3a353ac
	var iexecconsensus = ethers.utils.keccak256(iexeccallback);
	fs.writeFile(callbackFilePath,    iexeccallback , (err) => {});
	fs.writeFile(determinismFilePath, iexecconsensus, (err) => {});

	console.log(`- Success: ${deliveryStatus}`);
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
