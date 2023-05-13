import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

export type Status =
  | 'open0'
  | 'open1'
  | 'open2'
  | 'open3'
  | 'open4'
  | 'open5'
  | 'open6'
  | 'open7'
  | 'open8'
  | 'bombrevealed'
  | 'bombdeath'
  | 'blank'
  | 'bombflagged'
  | string;

export interface Block {
  isMine: boolean;
  isChecked: boolean;
  blockIdx: number;
  status: Status;
  aroundBomb: number;
  searchableBlockIdx: number[];
}

export interface Data {
  blocks: Block[];
}

const { actions, reducer } = createSlice({
  name: 'data',
  initialState: {
    blocks: [] as Block[],
  } as Data,
  reducers: {
    setBlocks(
      state,
      {
        payload,
      }: PayloadAction<{
        width: number;
        height: number;
        bomb: number;
      }>
    ) {
      const blocks: Block[] = [];
      const randomNumbers: number[] = [];
      for (let i = 0; i < payload.width * payload.height; i++) {
        let searchableBlockIdx: number[] = [];

        let cases = [
          { value: 1, idx: 1 },
          { value: payload.width + 1, idx: 2 },
          { value: payload.width, idx: 3 },
          { value: payload.width - 1, idx: 4 },
          { value: -1, idx: 5 },
          { value: -1 * (payload.width + 1), idx: 6 },
          { value: -1 * payload.width, idx: 7 },
          { value: -1 * (payload.width - 1), idx: 8 },
        ];

        if (i % payload.height === 0) {
          cases = cases.filter(
            (caseObj) =>
              caseObj.idx !== 4 && caseObj.idx !== 5 && caseObj.idx !== 6
          );
        }

        if (i % payload.height === payload.height - 1) {
          cases = cases.filter(
            (caseObj) =>
              caseObj.idx !== 1 && caseObj.idx !== 2 && caseObj.idx !== 8
          );
        }

        for (let j = 0; j < cases.length; j++) {
          searchableBlockIdx.push(i + cases[j].value);
        }

        searchableBlockIdx = searchableBlockIdx.filter(
          (idx) => idx >= 0 && idx < payload.height * payload.width
        );

        const block: Block = {
          isMine: false,
          isChecked: false,
          blockIdx: i,
          searchableBlockIdx,
          status: 'blank',
          aroundBomb: 0,
        };

        blocks.push(block);
      }

      while (1) {
        const newRandomNumber = Math.floor(
          Math.random() * (payload.width * payload.height)
        );
        if (!randomNumbers.includes(newRandomNumber)) {
          randomNumbers.push(newRandomNumber);
        }
        if (randomNumbers.length === payload.bomb) {
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

      return { ...state, blocks };
    },
    checkBlock(state, { payload }: PayloadAction<{ blockIdx: number }>) {
      const blocks = [...state.blocks];

      blocks.splice(payload.blockIdx, 1, {
        ...blocks[payload.blockIdx],
        isChecked: true,
      });

      if (blocks[payload.blockIdx].isMine) {
        blocks.splice(payload.blockIdx, 1, {
          ...blocks[payload.blockIdx],
          status: 'bombdeath',
        });

        return { ...state, blocks };
      }
      if (blocks[payload.blockIdx].aroundBomb !== 0) {
        blocks.splice(payload.blockIdx, 1, {
          ...blocks[payload.blockIdx],
          status: `open${blocks[payload.blockIdx].aroundBomb}`,
        });
        return { ...state, blocks };
      } else {
        blocks.splice(payload.blockIdx, 1, {
          ...blocks[payload.blockIdx],
          status: 'open0',
        });

        searchBlocks({ idxList: blocks[payload.blockIdx].searchableBlockIdx });

        return { ...state, blocks };
      }

      function searchBlocks({ idxList }: { idxList: number[] }) {
        for (let i = 0; i < idxList.length; i++) {
          if (blocks[idxList[i]].aroundBomb !== 0) {
            blocks.splice(blocks[idxList[i]].blockIdx, 1, {
              ...blocks[idxList[i]],
              isChecked: true,
              status: `open${blocks[idxList[i]].aroundBomb}`,
            });
          } else if (
            blocks[idxList[i]].aroundBomb === 0 &&
            !blocks[idxList[i]].isChecked
          ) {
            blocks.splice(blocks[idxList[i]].blockIdx, 1, {
              ...blocks[idxList[i]],
              isChecked: true,
              status: `open${blocks[idxList[i]].aroundBomb}`,
            });

            searchBlocks({ idxList: blocks[idxList[i]].searchableBlockIdx });
          }
        }
      }
    },
    setAroundBomb(state, { payload }: PayloadAction<{ blockIdx: number }>) {
      const blocks = [...state.blocks];
      let aroundBomb = 0;
      const searchableBlockIdx = blocks[payload.blockIdx].searchableBlockIdx;
      console.log(payload.blockIdx);

      for (let i = 0; i < searchableBlockIdx.length; i++) {
        if (blocks[searchableBlockIdx[i]].isMine) {
          aroundBomb += 1;
        }
      }
      blocks.splice(payload.blockIdx, 1, {
        ...blocks[payload.blockIdx],
        aroundBomb,
        status: blocks[payload.blockIdx].isMine
          ? 'bombrevealed'
          : `open${aroundBomb}`,
      });

      return { ...state, blocks };
    },
  },
});

export const { setBlocks, checkBlock, setAroundBomb } = actions;
export default reducer;