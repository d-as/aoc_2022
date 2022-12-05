import fs from 'fs';
import path from 'path';

export const getDayFromFilename = (filename: string): number => {
  const [day] = path.basename(filename).match(/\d+/) as RegExpMatchArray;
  return Number(day);
}

export const getInputLines = (filename: string): string[] => {
  const inputPath = path.join(__dirname, 'input', `input-${getDayFromFilename(filename)}.txt`);
  return fs.readFileSync(inputPath).toString().split('\n');
};
