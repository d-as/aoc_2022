import fs from 'fs';
import path from 'path';

const inputPath = path.join(__dirname, '../input', 'input-2.txt');

enum Hand {
  ROCK = 1,
  PAPER = 2,
  SCISSORS = 3,
}

enum Result {
  LOSS = 0,
  DRAW = 3,
  WIN = 6,
}

type OpponentSymbol = 'A' | 'B' | 'C';
type PlayerSymbol = 'X' | 'Y' | 'Z';
type InputSymbol = OpponentSymbol | PlayerSymbol;

const HANDS: Record<InputSymbol, Hand> = {
  A: Hand.ROCK,
  B: Hand.PAPER,
  C: Hand.SCISSORS,
  X: Hand.ROCK,
  Y: Hand.PAPER,
  Z: Hand.SCISSORS,
};

const RESULTS: Record<PlayerSymbol, Result> = {
  X: Result.LOSS,
  Y: Result.DRAW,
  Z: Result.WIN,
};

const getResult = (opponent: Hand, player: Hand): Result => {
  if (opponent === Hand.ROCK && player === Hand.SCISSORS) {
    return Result.LOSS;
  } else if (opponent === Hand.ROCK && player === Hand.PAPER) {
    return Result.WIN;
  } else if (opponent === Hand.PAPER && player === Hand.ROCK) {
    return Result.LOSS;
  } else if (opponent === Hand.PAPER && player === Hand.SCISSORS) {
    return Result.WIN;
  } else if (opponent === Hand.SCISSORS && player === Hand.ROCK) {
    return Result.WIN;
  } else if (opponent === Hand.SCISSORS && player === Hand.PAPER) {
    return Result.LOSS;
  }
  return Result.DRAW;
};

const getHand = (opponent: Hand, player: PlayerSymbol): Hand => {
  const result = RESULTS[player];

  if (result === Result.LOSS) {
    if (opponent === Hand.ROCK) {
      return Hand.SCISSORS;
    } else if (opponent === Hand.PAPER) {
      return Hand.ROCK;
    }
    return Hand.PAPER;
  } else if (result === Result.DRAW) {
    return opponent;
  }

  if (opponent === Hand.ROCK) {
    return Hand.PAPER;
  } else if (opponent === Hand.PAPER) {
    return Hand.SCISSORS;
  }
  return Hand.ROCK;
};

const lines = fs.readFileSync(inputPath).toString().split('\n');

let total1 = 0;
let total2 = 0;

lines.forEach(line => {
  const [opponent, player] = line.split(' ') as [OpponentSymbol, PlayerSymbol];
  const [opponentHand, playerHand1] = [opponent, player].map(hand => HANDS[hand]);
  const playerHand2 = getHand(opponentHand, player);

  total1 += playerHand1 + getResult(opponentHand, playerHand1);
  total2 += playerHand2 + getResult(opponentHand, playerHand2);
});

console.log('Part 1:', total1);
console.log('Part 2:', total2);
