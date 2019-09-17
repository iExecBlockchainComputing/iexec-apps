const ethers  = require('ethers');
const fs      = require('fs');
const axios = require('axios');

 
const root                = 'iexec_out';
const determinismFilePath = `${root}/determinism.iexec`;
const callbackFilePath    = `${root}/callback.iexec`;
const errorFilePath       = `${root}/error.iexec`;

/*****************************************************************************
 *                                  CONFIG                                   *
 *****************************************************************************/
const APIKEY = '87a1fd74e099f170b76906e87e19e9d9';

/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/

var [ lati , longi] = process.argv.slice(2).map(s => s);
console.log(longi);
console.log(lati);
/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/

let path = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&APPID=${APIKEY}`;

/*****************************************************************************
 *                                  EXECUTE                                  *
 *****************************************************************************/
axios.get(path)
.then(res=>{
	var result = res.data;
	var windSpeed = result.wind.speed;
	var weather =  result.weather[0].description;
	var timestamp = new Date().getTime();
	var details   = [ longi, lati].join('-');
	var value = [weather, windSpeed].join('-');

	var iexeccallback = ethers.utils.defaultAbiCoder.encode(['uint256', 'string', 'string'], [timestamp, details, value]);
	var iexecconsensus = ethers.utils.keccak256(iexeccallback);
	fs.writeFile(callbackFilePath,    iexeccallback , (err) => {});
	fs.writeFile(determinismFilePath, iexecconsensus, (err) => {});
})
.catch(err=>{
	fs.writeFile(
		errorFilePath,
		err.toString(),
		(error) => {}
	);
	fs.writeFile(
		determinismFilePath,
		ethers.utils.solidityKeccak256(['string'],[err.toString()]),
		(error) => {}
	);
	throw new Error(err);
})

