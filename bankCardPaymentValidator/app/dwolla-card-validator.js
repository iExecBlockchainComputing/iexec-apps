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

const Client = require("dwolla-v2").Client;

/*****************************************************************************
 *                                  CONFIG                                   *
 *****************************************************************************/

// dwolla api key
const APIKEY = process.env.DWOLLA_APP_KEY;
const SECRET = process.env.DWOLLA_APP_SECRET

/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/

 var dwolla = new Client({
   environment: "sandbox" // defaults to 'production'
 });

/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/
let URL='/api-sandbox.dwolla.com/transfers/${id}'; //In production use api.dwolla.com

const query = {
  method: 'GET',
	port:   443,
	host:   'api-sandbox.dwolla.com', //In production use api.dwolla.com
	path:   URL
};

/*****************************************************************************
 *                                  EXECUTE                                  *
 *****************************************************************************/
new Promise(async (resolve, reject) => {

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

  .then(res =>  const response = {
    return {
      amount: { currency: res.currency,
                value: res.value }
      correlationId: res.correlationId,
      request: {
        type: 'GET',
      }
    }
  } );

	var iexeccallback = ethers.utils.defaultAbiCoder.encode(['uint256', 'string', 'uint256'], [timestamp, details, value]);
	var iexecconsensus = ethers.utils.keccak256(iexeccallback);
	fs.writeFile(callbackFilePath,    iexeccallback , (err) => {});
	fs.writeFile(determinismFilePath, iexecconsensus, (err) => {});

	console.log(`- Success: ${results}`);
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
