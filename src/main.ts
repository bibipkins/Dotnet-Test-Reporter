const core = require('@actions/core');
const github = require('@actions/github');

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const getAbsolutePaths = (fileNames: string[], directoryName: string): string[] => {
  const absolutePaths: string[] = [];

  for (const file of fileNames) {
    const absolutePath = path.join(directoryName, file);
    absolutePaths.push(absolutePath);
  }

  return absolutePaths;
};

const getFiles = (trxPath: string): string[] => {
  console.log(`TRX Path: ${trxPath}`);
  if (!fs.existsSync(trxPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(trxPath);
  console.log(`Files count: ${fileNames.length}`);
  const trxFiles = fileNames.filter(f => f.endsWith('.trx'));
  console.log(`TRX Files count: ${trxFiles.length}`);
  const filesWithAbsolutePaths = getAbsolutePaths(trxFiles, trxPath);
  filesWithAbsolutePaths.forEach(f => console.log(`File: ${f}`));
  return filesWithAbsolutePaths;
};

const run = async () => {
  try {
    const trxPath = core.getInput('test-results');
    const filePaths = getFiles(trxPath);

    var parser = new xml2js.Parser();

    for (const path of filePaths) {
      const file = fs.readFileSync(path);
      const result = await parser.parseStringPromise(file);
      const times = result.TestRun.Times;
      console.dir(times[0]);
      const start = new Date(times[0].start);
      console.log(start);
      const finish = new Date(times[0].finish);
      console.log(finish);
      var milisconds = finish.getTime() - start.getTime();
      console.log(milisconds);
    }
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

run();
