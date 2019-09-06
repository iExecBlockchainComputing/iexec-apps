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
const APIKEY = 'nhHn9Q6iuRr1S5Cb';
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

	let tmpData = JSON.parse(results);
        let matches = tmpData.data.match;
      
        //loop fixtures
        matches.forEach((game)=>{
	

        let score=game.score.split('-');
        let homeScore=(parseInt(score[0])!==parseInt(score[0]))?0:parseInt(score[0]);
        let awayScore=(parseInt(score[1])!==parseInt(score[1]))?0:parseInt(score[1]);

       

	let iexecCallback = ethers.utils.defaultAbiCoder.encode(
		['string', 'string', 'string', 'string', 'uint256', 'string', 'uint256' ], 
		[game.status, game.location,  game.added, game.home_name, homeScore, game.away_name, awayScore]);

	let iexecDeterminism = ethers.utils.keccak256(iexecCallback);
	fs.writeFile(callbackFilePath, iexecCallback , (err) => {});
	fs.writeFile(determinismFilePath, iexecDeterminism, (err) => {});
	
	}); 

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
