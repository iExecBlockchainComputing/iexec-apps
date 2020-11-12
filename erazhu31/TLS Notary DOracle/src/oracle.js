const https   = require('https');
const ethers  = require('ethers');
const fs      = require('fs');

const sslCertificate = require('get-ssl-certificate')


const root                = 'iexec_out';
const determinismFilePath = `${root}/determinism.iexec`;
const callbackFilePath    = `${root}/callback.iexec`;
const errorFilePath       = `${root}/error.iexec`;





/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/
let URL = process.argv.slice(2);




/*****************************************************************************
 *                                  EXECUTE                                  *
 *****************************************************************************/

sslCertificate.get(`${URL}`).then(function (certificate) {


  let res= JSON.stringify(certificate)
  			
  let iexecCallback = ethers.utils.defaultAbiCoder.encode(['string'], [res]);
  let iexecDeterminism = ethers.utils.keccak256(iexecCallback);
  fs.writeFile(callbackFilePath, iexecCallback , (err) => {});
  fs.writeFile(determinismFilePath, iexecDeterminism, (err) => {});


  console.log(certificate)  

});

