import { Block } from '../../store/data';

export default function createBlocks({
  width,
  height,
  bomb,
  blockIdx,
}: {
  width: number;
  height: number;
  bomb: number;
  blockIdx: number;
}) {
  const blocks: Block[] = [];
  const randomNumbers: number[] = [];
  for (let i = 0; i < width * height; i++) {
    let searchableBlockIdx: number[] = [];

    let cases = [
      { value: 1, idx: 1 },
      { value: width + 1, idx: 2 },
      { value: width, idx: 3 },
      { value: width - 1, idx: 4 },
      { value: -1, idx: 5 },
      { value: -1 * (width + 1), idx: 6 },
      { value: -1 * width, idx: 7 },
      { value: -1 * (width - 1), idx: 8 },
    ];

    if (i % width === 0) {
      cases = cases.filter(
        (caseObj) => caseObj.idx !== 4 && caseObj.idx !== 5 && caseObj.idx !== 6
      );
    }

    if (i % width === width - 1) {
      cases = cases.filter(
        (caseObj) => caseObj.idx !== 1 && caseObj.idx !== 2 && caseObj.idx !== 8
      );
    }

    for (let j = 0; j < cases.length; j++) {
      searchableBlockIdx.push(i + cases[j].value);
    }

    searchableBlockIdx = searchableBlockIdx.filter(
      (idx) => idx >= 0 && idx < height * width
    );

    const block: Block = {
      isMine: false,
      isChecked: false,
      blockIdx: i,
      searchableBlockIdx,
      status: 'blank',
      aroundBomb: 0,
      isThereFlag: false,
    };

    blocks.push(block);
  }

  while (1) {
    const newRandomNumber = Math.floor(Math.random() * (width * height));

    if (
      !randomNumbers.includes(newRandomNumber) &&
      newRandomNumber !== blockIdx
    ) {
      randomNumbers.push(newRandomNumber);
    }

    console.log('렌덤고르는중!');
    if (randomNumbers.length === bomb) {
      break;
    }
  }

  for (let i = 0; i < randomNumbers.length; i++) {
    blocks.splice(randomNumbers[i], 1, {
      ...blocks[randomNumbers[i]],
      isMine: true,
    });
  }

  for (let i = 0; i < blocks.length; i++) {
    const searchableBlockIdx = blocks[i].searchableBlockIdx;
    let aroundBomb = 0;
    for (let j = 0; j < searchableBlockIdx.length; j++) {
      if (blocks[searchableBlockIdx[j]].isMine) {
        aroundBomb += 1;
      }
    }

    blocks.splice(i, 1, { ...blocks[i], aroundBomb });
  }

  return blocks;
}
