import { getInputLines } from './util';

enum LineType {
  ROW,
  COLUMN,
}

enum ReverseType {
  NONE,
  REVERSED,
}

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

type Coordinate = [number, number];
type Grid = number[][];

const DIRECTION_OFFSETS: Record<Direction, Coordinate> = {
  [Direction.UP]: [0, -1],
  [Direction.DOWN]: [0, 1],
  [Direction.LEFT]: [-1, 0],
  [Direction.RIGHT]: [1, 0],
};

const DIRECTIONS = Object.values(Direction);

const getAbsoluteCoordinate = (
  [i, j]: Coordinate,
  lineType: LineType,
  reverse: ReverseType,
  length: number,
): Coordinate => (
  (lineType === LineType.ROW ? [j, i] : [i, j]).map((n, type) => (
    !reverse || lineType !== type ? n : length - n - 1
  )) as Coordinate
);

const getScenicScoreForDirection = (coordinate: Coordinate, grid: Grid, direction: Direction): number => {
  let score = 0;
  let [x, y] = coordinate;
  const height = grid[x][y];
  const [xOffset, yOffset] = DIRECTION_OFFSETS[direction];

  while (true) {
    const tree = grid[x + xOffset]?.[y + yOffset];

    if (tree !== undefined) {
      score++;
      [x, y] = [x + xOffset, y + yOffset];

      if (tree >= height) {
        break;
      }
    } else {
      break;
    }
  }
  return score;
};

const range = (size: number): number[] => [...Array(size).keys()];

const rows = getInputLines(__filename);
const [firstRow] = rows;
const columns = [...firstRow].map((_, i) => rows.map(row => row[i]).join(''));
const grid: Grid = columns.map(column => [...column].map(Number));

const visibleTrees = new Set([rows, columns].flatMap((lines, lineType: LineType) => (
  lines.flatMap((line, i) => (
    [line, [...line].reverse().join('')].flatMap((trees, reverse: ReverseType) => (
      [...trees]
        .map((height, j) => (
          [...trees].slice(0, j).every(tree => height > tree)
            ? getAbsoluteCoordinate([i, j], lineType, reverse, line.length).join(',')
            : undefined
        ))
        .filter(tree => tree)
    ))
  ))
)));

const [highestScenicScore] = range(columns.length).flatMap(x => (
  range(rows.length).map(y => DIRECTIONS.slice(DIRECTIONS.length / 2).reduce((total, direction) => (
    total * getScenicScoreForDirection([x, y], grid, direction as Direction)
  ), 1))
))
  .sort((a, b) => b - a);

console.log('Visible trees:', visibleTrees.size);
console.log('Highest scenic score:', highestScenicScore);
