const https = require('https');
const ethers  = require('ethers');
const fs = require('fs');

const root = 'iexec_out';
const determinismFilePath = `${root}/determinism.iexec`;
const callbackFilePath = `${root}/callback.iexec`;
const errorFilePath = `${root}/error.iexec`;

/*****************************************************************************
 *                                   TOOLS                                   *
 *****************************************************************************/

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const cat = (path) => {
    try {
        return fs.readFileSync(path).toString();
    } catch (e) {
        return null;
    };
}

// modified web3 utils.js
const leftPadNoPrefix = (string, chars, sign) => {
    string = string.toString(16).replace(/^0x/i, '');

    const padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;

    return new Array(padding).join(sign || '0') + string;
};

const isHexString = (hex) => {
    return ((typeof (hex) === 'string' || typeof (hex) === 'number') && /^(-)?[0-9a-f]*$/i.test(hex));
}

const isHexStrict = (hex) => {
    return ((typeof (hex) === 'string' || typeof (hex) === 'number') && /^(-)?0x[0-9a-f]*$/i.test(hex));
}

/*****************************************************************************
 *                                  CONFIG                                   *
 *****************************************************************************/

// public API but key may be needed in future to avoid being rate limited (use dataset)
const APIKEY = cat(`/iexec_in/${process.env.DATASET_FILENAME}`) || undefined;

// random delay
const WAIT_MIN = parseInt(process.env.WAIT_MIN) || 0; // in ms
const WAIT_MAX = parseInt(process.env.WAIT_MAX) || 0; // in ms

/*****************************************************************************
 *                                 ARGUMENTS                                 *
 *****************************************************************************/

const validFunctions = ['TXHASHAMT'];

let argFun = undefined;
let argVal = undefined;

var args = process.argv.slice(2).map(s => s);

switch (true) {

	case !args[0]:{
		argFun = 'FUNERROR';
		break;
	}
    case validFunctions.includes(args[0].toUpperCase()): {
        argFun = args[0];
        argVal = args[1];
        break;
    }
    case isHexString(args[0]) && args[0].length == 64: {
        argFun = 'TXHASHAMT';
        argVal = args[0];
        break;
    }
    default: {
        argFun = 'FUNERROR';
    }
}

/*****************************************************************************
 *                                  HTTP QUERY                               *
 *****************************************************************************/

let path = undefined;

switch (argFun) {

    case 'TXHASHAMT': {
        if (argVal) path = `/rawtx/${argVal}`;
        break;
    }
}

const query = {
    method: 'GET',
    port: 443,
    host: 'blockchain.info',
    path: path,
};

if (APIKEY) query['headers'] = { key: APIKEY };

/*****************************************************************************
 *                              EXECUTE                                      *
 *****************************************************************************/

new Promise(async (resolve, reject) => {
        console.log(`* blockchain.info API *`);
        console.log(`- User Args: [${args}]`);
        console.log(`- Function: ${argFun}`);
        console.log(`- Input: ${argVal ? `${argVal}`: `${false}`}`);
        console.log(`- API key: ${APIKEY ? `${true}`: `${false}`}`);

        if (argFun == 'FUNERROR') {
            return reject(`invalid API function or value format, please select from: ${validFunctions} or use valid default format`);
        } else if (!query.path) {
            return reject(`invalid or undefined args value input for API function`);
        }

        const delay = (WAIT_MAX - WAIT_MIN) * Math.random() + WAIT_MIN;
        console.log(`- Waiting for ${delay} ms.`);
        await sleep(delay);

        console.log(`- API url: ${query.host}${query.path}\n- Calling blockchain.info API`);

        let chunks = [];
        let request = https.request(query, res => {
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                if (chunks.length) {
                    resolve(chunks.join(''));
                } else {
                    reject(`*[HTTP ERROR]\nstatusCode: ${res.statusCode}*`);
                }
            });
        });
        request.on('error', reject);
        request.end();

    })
    .then(data => {

        let results;

        try {
            results = JSON.parse(data.toString());
        } catch (e) {
            // allow non JSON results for functions or just throw error
            throw `${data.toString()}`;
        }

        if (results.error !== undefined) {
            throw `API returned an error for function "${argFun}" with input "${argVar}". (${results.error})`;
        }

        let apiDataID = undefined; // HexStrict, serves as smart contract SSTORE lookup id
        let apiData = undefined;

        // using swith for standardization between node apps/doracles
        switch (argFun) {

            case 'TXHASHAMT': {
                let details = results.hash;
                apiDataID = '0x' + details;
                
                let totalAmount = 0;
                outputs = results.out; // add value of each output in tx
                outputs.forEach(function(output) {
                    totalAmount += parseInt(output.value);
                });

                let timestamp = parseInt(results.time);

                // max 27 bytes (minus timestamp) between all values (when converted to hex)
                // in this case only totalAmount is needed
                apiData = [
                {name: 'total_amount', value: totalAmount, size: 27},
                {name: 'time', value:timestamp, size: 5}
                ];

                break;
            }
        }

        console.log(`- API data ID: ${apiDataID}`);
        console.log(`- API data: ${JSON.stringify(apiData)}`);

        // data validation||conversion
        let apiDataHex = '';
   
        if (apiDataID.toLowerCase() !== '0x' + argVal.toLowerCase()){
            throw `invalid results- apiDataID does not match input tx hash (${apiDataID}) -- API error`;
        }

        // packing data (uint40,uint216) into 1 uint256
		// equal or less than 32 bytes total (27 bytes values, 5 bytes timestamp)
		apiData.forEach(function (entry) {
  			apiDataHex += leftPadNoPrefix(entry.value, entry.size * 2);
		});

        let apiPackedData = '0x' + apiDataHex;

        // user error check here instead of trimming to 32 bytes (64 places)
        if (apiPackedData.length > 66) throw `invalid packed data size- data must be less than or equal to 32 bytes (${apiPackedData}) -- API error`;

        let abiData = [apiDataID, apiPackedData];
        let abiTypes = Array.from(abiData, x => 'uint256');

        console.log(`- ABI Types: ${abiTypes}\n- ABI Data: ${abiData}`);

        var iexeccallback = ethers.utils.defaultAbiCoder.encode(abiTypes, abiData);
        var iexecconsensus = ethers.utils.keccak256(iexeccallback);

        fs.writeFile(callbackFilePath,    iexeccallback , (err) => {});
        fs.writeFile(determinismFilePath, iexecconsensus, (err) => {});

        //console.log(`- callback: ${iexeccallback}\n- consensus: ${iexecconsensus}`);
        console.log(`* end *`);
    })
    .catch(error => {
        fs.writeFile(
            errorFilePath,
            error.toString(),
            (err) => {}
        );
        fs.writeFile(
            determinismFilePath,
            ethers.utils.solidityKeccak256(['string'], [error.toString()]),
            (err) => {}
        );

        console.log(`ERROR: ${error.toString()}\n*APP exiting because of error*`);
    });