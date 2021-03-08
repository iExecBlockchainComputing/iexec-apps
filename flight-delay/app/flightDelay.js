const ethers  = require('ethers');
const fs      = require('fs');
const axios = require('axios');

 
const root                = 'iexec_out';
const determinismFilePath = `${root}/determinism.iexec`;
const callbackFilePath    = `${root}/callback.iexec`;
const errorFilePath       = `${root}/error.iexec`;


/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/

var [id, timestamp] = process.argv.slice(2).map(s => s);

var appId = '0ddf43fd';
var appKey = 'c8663643d1b8d907717810f38f97ffb1';

// var timestampInMili = new Date().getTime();
// var timestamp = parseInt(timestampInMili/1000)
// console.log(longi);
// console.log(lati);
// console.log(timestamp);
//flightID = 1023084433
/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/

let url = `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/${id}?appId=${appId}&appKey=${appKey}`;
/*****************************************************************************
 *                                  EXECUTE                                  *
 *****************************************************************************/
axios.get(url)
.then(res=>{
	// console.log(res);
    var result = res.data;
    var delay = parseInt(result.flightStatus.delays.departureGateDelayMinutes);
    console.log(delay);
    var iexeccallback = ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256', 'uint256'], [timestamp, id, delay]);
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

