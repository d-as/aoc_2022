import { getInputLines } from './util';

const lines = getInputLines(__filename);

enum Direction {
  UP = 'U',
  DOWN = 'D',
  LEFT = 'L',
  RIGHT = 'R',
}

type Coordinate = [number, number];

const INSTRUCTION_REGEX = new RegExp(`^([${Object.values(Direction).join('')}]) (\\d+)$`);

const DIRECTION_OFFSETS: Record<Direction, Coordinate> = {
  [Direction.UP]: [0, -1],
  [Direction.DOWN]: [0, 1],
  [Direction.LEFT]: [-1, 0],
  [Direction.RIGHT]: [1, 0],
};

const createRope = (length: number): Coordinate[] => (
  Array(length).fill([0, 0])
);

const positionDiff = ([x1, y1]: Coordinate, [x2, y2]: Coordinate): Coordinate => (
  [x2 - x1, y2 - y1]
);

const positionsTouch = (position1: Coordinate, position2: Coordinate): boolean => (
  positionDiff(position1, position2).every(diff => Math.abs(diff) <= 1)
);

const updateHeadPosition = ([x, y]: Coordinate, direction: Direction): Coordinate => {
  const [xOffset, yOffset] = DIRECTION_OFFSETS[direction];
  return [x + xOffset, y + yOffset];
};

const updatePosition = (position: Coordinate, targetPosition: Coordinate): [Coordinate, Coordinate[]] => {
  const visitedPositions = [position];

  while (!positionsTouch(targetPosition, position)) {
    const [xDiff, yDiff] = positionDiff(targetPosition, position);

    const [xOffset, yOffset] = [xDiff, yDiff].map(diff => (
      (xDiff && yDiff) || Math.abs(diff) > 1 ? -Math.sign(diff) : 0
    ));

    const [x, y] = position;
    position = [x + xOffset, y + yOffset];
    visitedPositions.push(position);
  }
  return [position, visitedPositions];
};

const pairwise = <T>(array: T[]): Array<[T, T]> => (
  array.slice(0, array.length - 1).map((item, i) => [item, array[i + 1]])
);

const range = (size: number): number[] => [...Array(size).keys()];

const getVisitedTailPositions = (rope: Coordinate[], input: string[]): Set<string> => {
  const ropeRange = range(rope.length);

  return new Set(
    input.reduce((visitedTailPositions, line) => {
      const [, direction, amount] = line.match(INSTRUCTION_REGEX) as RegExpMatchArray;
      const newVisitedTailPositions: Coordinate[] = [];

      range(Number(amount)).forEach(_ => {
        rope[0] = updateHeadPosition(rope[0], direction as Direction);

        pairwise(ropeRange).forEach(([a, b]) => {
          let visitedPositions: Coordinate[] = [];
          [rope[b], visitedPositions] = updatePosition(rope[b], rope[a]);
  
          if (b === rope.length - 1) {
            newVisitedTailPositions.push(...visitedPositions);
          }
        });
      });

      return [...visitedTailPositions, ...newVisitedTailPositions];
    }, [] as Coordinate[])
      .map(position => position.join(','))
  );
};

[createRope(2), createRope(10)].forEach(rope => (
  console.log(`Visited tail positions (rope length = ${rope.length}):`, getVisitedTailPositions(rope, lines).size)
));
