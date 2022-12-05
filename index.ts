import fs from 'fs';
import { exec } from 'child_process';
import { getDayFromFilename } from './src/util';

const [latestFile] = fs.readdirSync('src')
  .filter(file => file.match(/day-\d+/))
  .sort((a, b) => getDayFromFilename(b) - getDayFromFilename(a));

exec(`ts-node src/${latestFile}`, (error, stdout, stderr) => {
  if (error) {
    return console.error(error);
  } else if (stdout) {
    console.log(stdout);
  } else if (stderr) {
    console.error(stderr);
  }
});
