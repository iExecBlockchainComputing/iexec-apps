const https   = require('https');
const ethers  = require('ethers');
const fs      = require('fs');

// const asset_id_base  = "BTC"
// const asset_id_quote = "USD"
// const power          = 9
// const time = new Date().toISOString();

const [ asset_id_base, asset_id_quote, power, time ] = process.argv.slice(2);
const rootfolder = "/iexec_out/"

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
		var date    = new Date(results.time).getTime();
		var details = [ results.asset_id_base, results.asset_id_quote, power].join("-")
		var value   = Math.round(results.rate * 10**power)
		console.log(date, details, value)

		var iexeccallback = ethers.utils.defaultAbiCoder.encode(['uint256', 'string', 'uint256'], [date, details, value]);
		var iexecconsensus = ethers.utils.keccak256(iexeccallback);
		fs.writeFile(rootfolder+'callback.iexec',  iexeccallback , (err) => {});
		fs.writeFile(rootfolder+'consensus.iexec', iexecconsensus, (err) => {});
	})
	.catch(error => {
		fs.writeFile(
			rootfolder+'error.txt',
			error.toString(),
			(err) => {}
		);
		fs.writeFile(
			rootfolder+'consensus.iexec',
			ethers.utils.solidityKeccak256(['string'],[error.toString()]),
			(err) => {}
		);
	});
