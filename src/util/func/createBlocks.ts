import { Block } from '../../store/data';

// 받은 인수 (width, height, block, blockIdx)를 기준으로 블럭들을 생성하는 함수입니다.
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
  // 갯수가 width * height인 block들을 생성합니다.
  for (let i = 0; i < width * height; i++) {
    let searchableBlockIdx: number[] = [];

    // 한 블럭을 기준으로 도달할 수 있는 블록의 경우의 수를 구합니다.
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

    // 한 블록을 기준으로 블록의 idx가 세로열 중 첫번째 열에 속한다면 바깥 영역인 case를 제외합니다.
    if (i % width === 0) {
      cases = cases.filter(
        (caseObj) => caseObj.idx !== 4 && caseObj.idx !== 5 && caseObj.idx !== 6
      );
    }

    // 한 블록을 기준으로 블록의 idx가 세로열 중 마지막 열에 속한다면 바깥 영역인 case를 제외합니다.
    if (i % width === width - 1) {
      cases = cases.filter(
        (caseObj) => caseObj.idx !== 1 && caseObj.idx !== 2 && caseObj.idx !== 8
      );
    }

    // 한 블럭을 기준으로 도달가능한 블럭들의 idx들을 계산하여 searchableBlockIdx 배열에 저장합니다.
    for (let j = 0; j < cases.length; j++) {
      searchableBlockIdx.push(i + cases[j].value);
    }

    // searchableBlockIdx 배열 중 0 이상, width*height 미만의 idx가 있다면 필터링해줍니다.
    searchableBlockIdx = searchableBlockIdx.filter(
      (idx) => idx >= 0 && idx < height * width
    );

    // 블록을 생성합니다.
    const block: Block = {
      isMine: false,
      isChecked: false,
      blockIdx: i,
      searchableBlockIdx,
      status: 'blank',
      aroundBomb: 0,
      isThereFlag: false,
    };

    // 생성한 블럭을 blocks 배열에 추가합니다.

    blocks.push(block);
  }

  // 폭탄의 갯수로 랜덤한 block들의 idx값들을 세팅합니다.
  while (1) {
    // 난수를 설정합니다.
    const newRandomNumber = Math.floor(Math.random() * (width * height));

    // 이미 randomNumbers 배열에 있는 수가 아니라면 randomNumbers 배열에 추가합니다.
    // createBlocks의 인수인 blockIdx가 아니라면 randomNumbers 배열에 추가합니다. -> 처음 눌렀을 때 폭탄일 경우 블록을 재배치 할때 사용
    if (
      !randomNumbers.includes(newRandomNumber) &&
      newRandomNumber !== blockIdx
    ) {
      randomNumbers.push(newRandomNumber);
    }
    // 폭탄의 수가 randomNumbers 배열에 잘 세팅이 되면 무한반복문을 멈춥니다.
    if (randomNumbers.length === bomb) {
      break;
    }
  }

  // randomNumbers로 폭탄을 세팅합니다.
  for (let i = 0; i < randomNumbers.length; i++) {
    blocks.splice(randomNumbers[i], 1, {
      ...blocks[randomNumbers[i]],
      isMine: true,
    });
  }

  // 도달가능한 블록idx들을 각 블록들에게 세팅합니다.
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
  // 완성된 블록들을 리턴합니다.
  return blocks;
}
