import fs from 'fs';
import path from 'path';

const [day] = path.basename(__filename).match(/\d+/) as RegExpMatchArray;
const inputPath = path.join(__dirname, 'input', `input-${day}.txt`);

const lines = fs.readFileSync(inputPath).toString().split('\n');

const totals = lines.reduce(([sumContains, sumOverlaps], line) => {
  const ranges = line.split(',').map(range => range.split('-').map(Number));
  const [[start1, end1], [start2, end2]] = ranges;
  const [earlyStart, lateStart] = [start1, start2].sort((a, b) => a - b);
  const [earlyEnd, lateEnd] = [end1, end2].sort((a, b) => a - b);

  const oneRangeContainsTheOther = ranges.some(([start, end]) => (
    start === earlyStart && end === lateEnd
  ));

  const rangesOverlap = lateStart <= earlyEnd;

  return [
    sumContains + (oneRangeContainsTheOther ? 1 : 0),
    sumOverlaps + (rangesOverlap ? 1 : 0),
  ];
}, [0, 0])

totals.forEach((total, i) => console.log(`Total ${i + 1}: ${total}`));
