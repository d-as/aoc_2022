import fs from 'fs';
import path from 'path';

const inputPath = path.join(__dirname, 'input', 'input-3.txt');

const getPriority = (item: string): number => (
  /[a-z]/.test(item)
    ? item.charCodeAt(0) - 'a'.charCodeAt(0) + 1
    : item.charCodeAt(0) - 'A'.charCodeAt(0) + 27
);

const splitToChunks = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const sacks = fs.readFileSync(inputPath).toString().split('\n');

const total1 = sacks.reduce((sum, sack) => {
  const compartment1 = sack.slice(0, sack.length / 2);
  const compartment2 = sack.slice(sack.length / 2);
  const sharedItem = [...compartment1].find(item => compartment2.includes(item)) as string;
  return sum + getPriority(sharedItem);
}, 0);

const total2 = splitToChunks(sacks, 3).reduce((sum, [sack1, sack2, sack3]) => {
  const sharedItem = [...sack1].find(item => sack2.includes(item) && sack3.includes(item)) as string;
  return sum + getPriority(sharedItem);
}, 0);

console.log('Part 1:', total1);
console.log('Part 2:', total2);
