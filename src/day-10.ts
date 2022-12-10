import { getInputLines } from './util';

const lines = getInputLines(__filename);

enum Instruction {
  NOOP = 'noop',
  ADDX = 'addx',
}

const INSTRUCTION_CYCLE_TIMES: Record<Instruction, number> = {
  [Instruction.NOOP]: 1,
  [Instruction.ADDX]: 2,
};

const INSTRUCTION_REGEX = new RegExp(`^(${Object.values(Instruction).join('|')})(?: (\\-?\\d+))?$`);

const updateCRT = (CRT: string, X: number): string => {
  CRT += Math.abs(CRT.length + 1 - X) <= 1 ? '#' : '.';

  if (CRT.length === 40) {
    console.log(`#${CRT.slice(0, 39)}`);
    CRT = '';
  }
  return CRT;
};

const observeSignalStrengths = (startCycle: number, cycleInterval: number): number => {
  let cycle = 0;
  let X = 1;
  let CRT = '';
  const signalStrengths: number[] = [];

  const advanceCycles = (cycles: number, operation: (x: number) => number): void => {
    for (let i = 0; i < cycles; i++) {
      cycle++;
      X = i === cycles - 1 ? operation(X) : X;
      signalStrengths.push((cycle - startCycle) % cycleInterval ? 0 : cycle * X);
      CRT = updateCRT(CRT, X);
    }
  };

  lines.forEach(line => {
    const [, instruction, V] = line.match(INSTRUCTION_REGEX) as RegExpMatchArray;

    advanceCycles(
      INSTRUCTION_CYCLE_TIMES[instruction as Instruction],
      instruction === Instruction.ADDX
        ? x => x + Number(V)
        : x => x,
    );
  });

  return signalStrengths.reduce((total, strength) => total + strength, 0);
};

console.log('\nSum of signal strengths:', observeSignalStrengths(20, 40));
