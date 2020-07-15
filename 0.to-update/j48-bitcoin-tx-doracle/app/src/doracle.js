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
};

const cat = (path) => {
    try {
        return fs.readFileSync(path).toString();
    } catch (e) {
        return null;
    }
};

// modified web3 utils.js
const isHexString = (hex) => {
    return ((typeof hex === 'string' || typeof hex === 'number') && /^(-)?[0-9a-f]*$/i.test(hex));
};

// 0x prefix bool added (used when packing)
const leftPad = (string, chars, sign='0', prefix=true) => {
    // given number or hex string will return with 0x prefix by default
    const hasPrefix = /^0x/i.test(string) || isHexString(string);
    string = string.toString(16).replace(/^0x/i, '');

    const padding = chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;
    if(prefix) return (hasPrefix ? '0x' : '') + new Array(padding).join(sign) + string;
    return new Array(padding).join(sign) + string;
};

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

const args = process.argv.slice(2).map(s => s.toUpperCase());

var txHash;

// allows only hexstring of 32 bytes (bitcoin transaction hash format)
if (isHexString(args[0]) && args[0].length == 64){
    txHash = args[0];
}

/*****************************************************************************
 *                                  HTTP QUERY                               *
 *****************************************************************************/

let path = `/rawtx/${txHash}`;

const query = {
    method: 'GET',
    port: 443,
    host: 'blockchain.info',
    path: path,
};

if (APIKEY) query.headers = { key: APIKEY };

/*****************************************************************************
 *                              EXECUTE                                      *
 *****************************************************************************/

new Promise(async (resolve, reject) => {
    console.log(`* blockchain.info API *`);
    console.log(`- Input: ${txHash ? `${txHash}`: '-Null-'}`);
    console.log(`- API key: ${APIKEY ? `${true}`: `${false}`}`);

    if (!txHash) {
        return reject(`Invalid Bitcoin transaction hash format`);
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

    // parse json
    try {
        results = JSON.parse(data.toString());
    } catch (e) {
        // allow non JSON results for functions or just throw error
        throw `${data.toString()}`;
    }

    if (results.error !== undefined) {
        throw `API returned an error. (${results.error})`;
    }

    // api results
    // numbers must be number type and not string type
    let details = results.hash;
    
    let totalAmount = 0;
    let outputs = results.out; // add value of each output in tx
    outputs.forEach(function(output) {
        totalAmount += parseInt(output.value);
    });

    let timestamp = parseInt(results.time);

    // validation logic
    if (details.toUpperCase() !== txHash){
        throw `invalid results- api tx hash does not match input tx hash (${details}) -- API error`;
    }

    if (isNaN(totalAmount)){
        throw `invalid results- api tx amount is not a number (${totalAmount}) -- API error`;
    }

    if (1230768000 > timestamp || timestamp > 253402300799) {
        // 1-1-2009 < timestamp < 12-31-9999
        throw `invalid results- timestamp is not a reasonable epoch time (${timestamp})-- API error`;
    }

    // data to send to smart contract from api results 
    // unique hex or string based on details used for lookup
    let apiDataID = {value: details, size: 32, type: 'bytes32'};

    // max 32 bytes between all values if packing (when converted to hex)
    // in this case only totalAmount/timestamp is needed
    let apiDataArray = [
    {value: totalAmount, size: 27, type: 'uint256'},
    {value: timestamp, size: 5, type: 'uint256'}
    ];

    console.log(`- API data ID: ${apiDataID.value}`);
    console.log(`- API data: ${JSON.stringify(apiDataArray)}`);

    // encode data to send to smart contract
    let abiData = [];
    let abiTypes = [];

    abiData.push(leftPad(apiDataID.value, 64));
    abiTypes.push(apiDataID.type);

    // packed bytes32 for aesthetics and saving gas
    let packedData = '';
    apiDataArray.forEach(function (entry) {
        packedData += leftPad(entry.value, entry.size * 2, '0', false);
    });
    
    // user error check here instead of trimming
    if (packedData.length > 64){
        throw `invalid packed data size, packed data must be less than or equal to 32 bytes`;
    }

    // packed data always bytes32 (bytes32 vs uint256?)
    abiData.push(leftPad(packedData, 64));
    abiTypes.push('bytes32');

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
