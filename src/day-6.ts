import { getInputLines } from './util';

const [line] = getInputLines(__filename);

const isStartOfPacket = (marker: string, length: number): boolean => (
  new Set([...marker]).size === length
);

const findMarker = (data: string, length: number): number => {
  let marker = '';
  let markerIndex = -1;
  
  [...data].some((character, i) => {
    if (marker.length < length) {
      marker += character;
    } else {
      if (isStartOfPacket(marker, length)) {
        markerIndex = i;
        return true;
      }
      marker = `${marker.slice(1)}${character}`;
    }
  });

  return markerIndex;
};

console.log('Start of packet:', findMarker(line, 4));
console.log('Start of message:', findMarker(line, 14));
