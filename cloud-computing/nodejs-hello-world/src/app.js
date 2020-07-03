const fsPromises = require('fs').promises;
const figlet = require('figlet');

const iexecOut = process.env.IEXEC_OUT;
const iexecIn = process.env.IEXEC_IN;
const datasetFilepath = `${iexecIn}/${process.env.IEXEC_DATASET_FILENAME}`;

(async () => {
  try {
    // Write hello to fs
    let text = process.argv.length > 2 ? `Hello, ${process.argv[2]}!` : 'Hello, World';
    text = `${figlet.textSync(text)}\n${text}`; // Let's add some art for e.g.

    // Eventually use some confidential assets
    try {
      const dataset = await fsPromises.readFile(datasetFilepath);
      text = `${text}\nConfidential dataset: ${dataset}`;
    } catch (e) {
      // dataset does not exists
    }
    // Append some results
    await fsPromises.writeFile(`${iexecOut}/result.txt`, text);
    console.log(text);
    // Declare everything is computed
    const computedJsonObj = {
      'deterministic-output-path': `${iexecOut}/result.txt`,
    };
    await fsPromises.writeFile(
      `${iexecOut}/computed.json`,
      JSON.stringify(computedJsonObj),
    );
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

/* Try
Basic:
mkdir -p /tmp/iexec_out && IEXEC_OUT=/tmp/iexec_out IEXEC_IN=/tmp/iexec_in node app.js Alice

Tee:
mkdir -p /tmp/iexec_out && IEXEC_OUT=/tmp/iexec_out IEXEC_IN=../tee/confidential-assets node app.js Alice
*/
