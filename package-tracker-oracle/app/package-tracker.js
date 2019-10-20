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

const APIKEY = process.env.APIKEY;

// random delay
const WAIT_MIN = parseInt(process.env.WAIT_MIN) || 0; // in ms
const WAIT_MAX = parseInt(process.env.WAIT_MAX) || 0; // in ms

const statusValue = {
	PRIS_EN_CHARGE: 		0,
	EN_LIVRAISON: 			1,
	EXPEDIE: 				2,
	A_RETIRER: 				3,
	TRI_EFFECTUE: 			4,
	DISTRIBUE: 				5,
	LIVRE: 					6,
	DESTINATAIRE_INFORME: 	7,
	RETOUR_DESTINATAIRE: 	8,
	ERREUR: 				9,
	INCONNU: 				10
}

/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/

var [ id ] = process.argv.slice(2).map(s => s.toUpperCase());

/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/
let path = `/suivi/v1/${id}`;

const query = {
	method: 'GET',
	port:   443,
	host:   'api.laposte.fr',
	path:   path,
	headers: { 'X-Okapi-Key': APIKEY },
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

	if (results.code == 'BAD_REQUEST' || results.code == 'RESOURCE_NOT_FOUND') 
	{
		throw new Error(results.message);
	}

	let { code, status } = results;

	if (code == undefined || status == undefined)
	{
		throw new Error("invalid results");
	}

	let statusNumber = statusValue[status];
	let date = new Date().getTime();

	let iexeccallback = ethers.utils.defaultAbiCoder.encode(['string', 'uint256', 'uint256'], [code, statusNumber, date]);
	let iexecconsensus = ethers.utils.keccak256(iexeccallback);
	fs.writeFile(callbackFilePath,    iexeccallback , (err) => {});
	fs.writeFile(determinismFilePath, iexecconsensus, (err) => {});

	console.log(`- Success: ${code} ${statusNumber} ${date}`);
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
