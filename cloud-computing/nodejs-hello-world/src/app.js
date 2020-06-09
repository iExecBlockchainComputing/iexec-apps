const fs = require('fs');
var figlet = require('figlet');

const iexec_out = process.env.IEXEC_OUT
const iexec_in = process.env.IEXEC_IN

// Write hello to fs
var text = "Hello, World!"
if (process.argv.length > 2){
  text = 'Hello, ' + process.argv[2] + '!'
}
text = figlet.textSync(text) + '\n' + text // Let's add some art for e.g.

// Eventually use some confidential assets
if (fs.existsSync(iexec_in + '/dataset.txt')) {
  var dataset = fs.readFileSync(iexec_in + '/dataset.txt');
  text = text + '\nConfidential dataset: ' + dataset
}

// Append some results
fs.writeFileSync(iexec_out + "/result.txt", text, {flag: 'w+'}, (err) => {
  if(err) {
      throw err;
  }
});
console.log(text);

// Declare everything is computed
var computedJsonObj = { "deterministic-output-path" : iexec_out + "/result.txt" }
fs.writeFile(iexec_out + "/computed.json", JSON.stringify(computedJsonObj), {flag: 'w+'}, (err) => {
  if(err) {
      throw err;
  }
  process.exit(0)
});

/* Try
Basic:
mkdir -p /tmp/iexec_out && IEXEC_OUT=/tmp/iexec_out IEXEC_IN=/tmp/iexec_in node app.js Alice

Tee:
mkdir -p /tmp/iexec_out && IEXEC_OUT=/tmp/iexec_out IEXEC_IN=../tee/confidential-assets node app.js Alice
*/
