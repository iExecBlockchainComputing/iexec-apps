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
const DARKSKYAPIKEY = '513d51692e7207ee17fe6bdf1d1d6414';

/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/

var [lati , longi, timestamp] = process.argv.slice(2).map(s => s);

// var timestampInMili = new Date().getTime();
// var timestamp = parseInt(timestampInMili/1000)
// console.log(longi);
// console.log(lati);
// console.log(timestamp);
/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/

let url = `https://api.darksky.net/forecast/${DARKSKYAPIKEY}/${lati},${longi},${timestamp}?exclude=hourly,daily,flags`;

/*****************************************************************************
 *                                  EXECUTE                                  *
 *****************************************************************************/
axios.get(url)
.then(res=>{
	// console.log(res);
	var result = res.data;
	var windSpeed = parseInt(result.currently.windSpeed * 1000);  //accuracy to 3 decimal points
	var weather =  result.currently.summary;
	console.log(windSpeed);
	console.log(weather);
	var iexeccallback = ethers.utils.defaultAbiCoder.encode(['uint256', 'string', 'string', 'uint256' , 'string'], [timestamp, longi, lati, windSpeed, weather]);
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

