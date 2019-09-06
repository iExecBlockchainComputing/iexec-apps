const axios = require('axios')
const fs = require('fs')
const ethers = require('ethers')

const determinismFilePath = `iexec_out/determinism.iexec`;
const callbackFilePath = `iexec_out/callback.iexec`;
const errorFilePath = `iexec_out/error.iexec`;
const API_URL = 'https://www.api-football.com/demo/api/v2/fixtures/id/';

let [id] = process.argv.slice(2)


async function main () {
	try {
		let result = await axios.get(API_URL+id);
		result = result.data.api.fixtures[0].score.fulltime;
		if(result) {
			let iexecCallback = ethers.utils.defaultAbiCoder.encode(['string'], [result]);
			let iexecDeterminism = ethers.utils.keccak256(iexecCallback);
			fs.writeFile(callbackFilePath, iexecCallback , (err) => {});
			fs.writeFile(determinismFilePath, iexecDeterminism, (err) => {});
			console.log(result)
		}
		else {
			throw new Error({error: "No result yet"})
		}
	}
	catch(error) {
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
		console.log(error)
	}
}
main();