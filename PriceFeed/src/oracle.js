const https   = require('https');
const ethers  = require('ethers');
const fs      = require('fs');

const root                = '/iexec_out';
const determinismFilePath = `${root}/determinism.iexec`;
const callbackFilePath    = `${root}/callback.iexec`;
const errorFilePath       = `${root}/error.iexec`;

var [ asset_id_base, asset_id_quote, power, time ] = process.argv.slice(2);
if (/^\d*$/.test(time)) { time = new Date(parseInt(time)*1000).toISOString(); }

// const asset_id_base  = "BTC"
// const asset_id_quote = "USD"
// const power          = 9
// const time           = new Date().toISOString();

const query = {
	method: 'GET',
	port:   443,
	host:   'rest.coinapi.io',
	path:   `/v1/exchangerate/${asset_id_base}/${asset_id_quote}?time=${time}`,
	headers: {'X-CoinAPI-Key': '69CC0AA9-1E4D-4E41-806F-8C3642729B88'},
};

new Promise(function (resolve, reject) {
	var request = https.request(query, function (response) { response.on("data", resolve) });
	request.on('error', reject);
	request.end();
})
.then(data => {
	var results = JSON.parse(data.toString());

	if (results.error !== undefined)
	{
		throw new Error(results.error);
	}

	var timestamp = new Date(results.time).getTime();
	var details   = [ results.asset_id_base, results.asset_id_quote, power].join("-")
	var value     = Math.round(results.rate * 10**power)

	if (isNaN(timestamp) || isNaN(value) || results.asset_id_base  == "" || results.asset_id_quote == "")
	{
		throw new Error("Error: invalid results " + JSON.stringify({query, results}));
	}

	var iexeccallback = ethers.utils.defaultAbiCoder.encode(['uint256', 'string', 'uint256'], [timestamp, details, value]);
	var iexecconsensus = ethers.utils.keccak256(iexeccallback);
	fs.writeFile(callbackFilePath,    iexeccallback , (err) => {});
	fs.writeFile(determinismFilePath, iexecconsensus, (err) => {});

	console.log("Success:", timestamp, details, value);
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
