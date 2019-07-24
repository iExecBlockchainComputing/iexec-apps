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

// livescore-api.com key 
const APIKEY = 'nhHn9Q6iuRr1S5Cb&secret';
const APISECRET ='dLFxyuKS8I43a6KyorVxi1QNTiPLnrWA';


/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/
let id = process.argv.slice(2);

/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/

let URL=`/api-client/scores/live.json?key=${APIKEY}&secret=${APISECRET}&competition_id=${id}`;


const query = {
  hostname: 'livescore-api.com',
  port: 443,
  path: URL,
  method: 'GET'
};


/*****************************************************************************
 *                                  EXECUTE                                  *
 *****************************************************************************/
new Promise(async (resolve, reject) => {



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
	
	let results =data.toString();
	if (results.error !== undefined)
	{
		throw new Error(results.error);
	}

			let iexecCallback = ethers.utils.defaultAbiCoder.encode(['string'], [result]);
			let iexecDeterminism = ethers.utils.keccak256(iexecCallback);
			fs.writeFile(callbackFilePath, iexecCallback , (err) => {});
			fs.writeFile(determinismFilePath, iexecDeterminism, (err) => {});

	console.log(`- Success:  ${results}`);
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
