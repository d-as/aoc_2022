import { getInputLines } from './util';

const lines = getInputLines(__filename);

enum CrateMover {
  MODEL_9000 = 'CrateMover 9000',
  MODEL_9001 = 'CrateMover 9001',
}

const CRATE_REGEX = /\[[A-Z]]/g;
const INSTRUCTION_REGEX = /move (\d+) from (\d+) to (\d+)/;

const arrangeCrates = (model: CrateMover): string => {
  const crates: Record<number, string[]> = {};

  lines.forEach(line => {
    if (new RegExp(CRATE_REGEX).test(line)) {
      Array.from(line.matchAll(new RegExp(CRATE_REGEX)))
        .map(match => {
          const [crate] = match;
          return [crate, ((match.index as number) / (crate.length + 1)) + 1] as [string, number];
        })
        .forEach(([crate, n]) => {
          crates[n] = [crate, ...(crates[n] ?? [])];
        });
    } else if (new RegExp(INSTRUCTION_REGEX).test(line)) {
      const [, count, from, to] = (line.match(new RegExp(INSTRUCTION_REGEX)) as RegExpMatchArray).map(Number);
      const movedCrates = crates[from].splice(crates[from].length - count);
      crates[to] = [...crates[to], ...(model === CrateMover.MODEL_9000 ? movedCrates.reverse() : movedCrates)];
    }
  });

  return Object.values(crates).map(crates => crates[crates.length - 1].slice(1, 2)).join('');
};

[CrateMover.MODEL_9000, CrateMover.MODEL_9001].forEach(model => console.log(`${model}: ${arrangeCrates(model)}`));
