const fsPromises = require('fs').promises;
const figlet = require('figlet');

const iexecOut = process.env.IEXEC_OUT;
const iexecIn = process.env.IEXEC_IN;
const datasetFilename = process.env.IEXEC_DATASET_FILENAME;
const datasetFilepath = `${iexecIn}/${datasetFilename}`;

(async () => {
  try {
    // Write hello to fs
    let text = process.argv.length > 2 ? `Hello, ${process.argv[2]}!` : 'Hello, World';
    text = `${figlet.textSync(text)}\n${text}\n`; // Let's add some art for e.g.

    // Eventually use some confidential assets
    try {
      const datasetContent = await fsPromises.readFile(datasetFilepath);
      text += `Dataset (${datasetFilepath}): ${datasetContent}\n`;
    } catch (e) {
      // confidential asset does not exist
      text += `No dataset was found\n`
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
