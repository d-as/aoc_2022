import fs from 'fs';
import path from 'path';

const lines = fs.readFileSync(path.join(__dirname, 'input', 'input-1.txt')).toString().split('\n');

const calories: number[][] = []
let currentTotal: number[] = [];

lines.forEach(line => {
  if (line.length) {
    currentTotal.push(Number(line))
  } else {
    calories.push(currentTotal);
    currentTotal = [];
  }
});

const sums = calories.map(c => c.reduce((a, b) => a + b, 0));

console.log('Part 1:', Math.max(...sums));

const sortedSums = sums.sort((a, b) => b - a);

console.log('Part 2:', sortedSums.slice(0, 3).reduce((a, b) => a + b, 0));
