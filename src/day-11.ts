import { getInputLines } from './util';

interface Monkey {
  id: string
  items: number[]
  operation: (old: number) => number
  test: (item: number) => boolean
  divisor: number
  trueTargetId: string
  falseTargetId: string
  inspectCount: number
}

enum Operator {
  PLUS = '+',
  MULTIPLY = '*',
}

enum Flag {
  TRUE = 'true',
  FALSE = 'false',
}

const OPERAND_OLD = 'old';

const MONKEY_REGEX = /^Monkey (\d+):$/;
const STARTING_ITEMS_REGEX = /Starting items: ((?:\d+(?:, )?)+)$/;

const OPERATION_REGEX = new RegExp(
  `Operation: new = ${OPERAND_OLD} (${Object.values(Operator).map(op => `\\${op}`).join('|')}) (\\d+|${OPERAND_OLD})$`,
);

const TEST_REGEX = /Test: divisible by (\d+)$/;
const IF_REGEX = /If (true|false): throw to monkey (\d+)$/;

const CHUNK_LENGTH = 7;

const splitToChunks = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const range = (size: number): number[] => [...Array(size).keys()];

const parseOperand = (value: string, old: number): number => (
  value === OPERAND_OLD ? old : Number(value)
);

const parseMonkeys = (input: string[]): Record<string, Monkey> => {
  const monkeys: Record<string, Monkey> = {};

  splitToChunks(input, CHUNK_LENGTH).forEach(chunk => {
    let monkey: Partial<Monkey> = {
      inspectCount: 0,
    };

    chunk.forEach(line => {
      if (MONKEY_REGEX.test(line)) {
        const [, id] = line.match(MONKEY_REGEX) as RegExpMatchArray;
        monkey.id = id;
      } else if (STARTING_ITEMS_REGEX.test(line)) {
        const [, startingItems] = line.match(STARTING_ITEMS_REGEX) as RegExpMatchArray;
        monkey.items = startingItems.split(', ').map(Number);
      } else if (OPERATION_REGEX.test(line)) {
        const [, operator, value] = line.match(OPERATION_REGEX) as RegExpMatchArray;

        monkey.operation = (
          old => operator === Operator.PLUS
            ? old + parseOperand(value, old)
            : old * parseOperand(value, old)
        );
      } else if (TEST_REGEX.test(line)) {
        const [, divisor] = line.match(TEST_REGEX) as RegExpMatchArray;
        monkey.test = item => item % Number(divisor) === 0;
        monkey.divisor = Number(divisor);
      } else if (IF_REGEX.test(line)) {
        const [, flag, monkeyId] = line.match(IF_REGEX) as RegExpMatchArray;
        const targetIdKey: keyof Monkey = flag === Flag.TRUE ? 'trueTargetId' : 'falseTargetId';
        monkey[targetIdKey] = monkeyId;
      }
    });

    monkeys[(monkey as Monkey).id] = monkey as Monkey;
  });

  return monkeys;
};

const getMonkeyBusinessLevel = (input: string[], rounds: number, worryDivisor: number): number => {
  const monkeys = parseMonkeys(input);
  const divisor = Object.values(monkeys).flatMap(monkey => monkey.divisor).reduce((a, b) => a * b);

  range(rounds).forEach(_ => {
    Object.values(monkeys).forEach(monkey => {
      monkey.items
        .map(item => Math.floor(monkey.operation(item) / worryDivisor) % divisor)
        .forEach(item => {
          monkey.inspectCount++;
          const targetId = monkey.test(item) ? monkey.trueTargetId : monkey.falseTargetId;
          monkeys[targetId].items.push(item);
        });
  
      monkey.items = [];
    });
  });

  return Object.values(monkeys)
    .sort((a, b) => b.inspectCount - a.inspectCount)
    .slice(0, 2)
    .reduce((total, monkey) => total * monkey.inspectCount, 1);
};

const input = getInputLines(__filename);

console.log('Level of monkey business 1:', getMonkeyBusinessLevel(input, 20, 3));
console.log('Level of monkey business 2:', getMonkeyBusinessLevel(input, 10_000, 1));
