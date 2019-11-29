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

var [id , timestamp] = process.argv.slice(2).map(s => s);

// var timestampInMili = new Date().getTime();
// var timestamp = parseInt(timestampInMili/1000)
// console.log(longi);
// console.log(lati);
// console.log(timestamp);
/*****************************************************************************
 *                                HTTP QUERY                                 *
 *****************************************************************************/

let url = `https://iexec-flight-data.herokuapp.com/delay/${id},${timestamp}`;
/*****************************************************************************
 *                                  EXECUTE                                  *
 *****************************************************************************/
axios.get(url)
.then(res=>{
	// console.log(res);
    var result = res.data;
    if(result.status == "found")
    {
        var delay = parseInt(result.delay);
        console.log(delay);
        var iexeccallback = ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256', 'uint256'], [timestamp, id, delay]);
        var iexecconsensus = ethers.utils.keccak256(iexeccallback);
        fs.writeFile(callbackFilePath,    iexeccallback , (err) => {});
        fs.writeFile(determinismFilePath, iexecconsensus, (err) => {});
    }
    else
    {
        throw 'ivalid id';
    }
	
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

