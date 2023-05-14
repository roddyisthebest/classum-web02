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
  | 'bombflagged';

export interface Block {
  isMine: boolean;
  isChecked: boolean;
  blockIdx: number;
  status: Status;
  aroundBomb: number;
  searchableBlockIdx: number[];
  isThereFlag: boolean;
}

export interface Data {
  blocks: Block[];
  gameStatus: {
    isOver: boolean;
    isComplete: boolean;
  };
}

const { actions, reducer } = createSlice({
  name: 'data',
  initialState: {
    blocks: [] as Block[],
    gameStatus: {
      isOver: false,
      isComplete: false,
    },
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

        if (i % payload.width === 0) {
          cases = cases.filter(
            (caseObj) =>
              caseObj.idx !== 4 && caseObj.idx !== 5 && caseObj.idx !== 6
          );
        }

        if (i % payload.width === payload.width - 1) {
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
          isThereFlag: false,
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
        for (let i = 0; i < blocks.length; i++) {
          if (!blocks[i].isChecked) {
            if (blocks[i].isMine) {
              blocks.splice(i, 1, {
                ...blocks[i],
                status: 'bombrevealed',
                isChecked: true,
              });
            } else {
              blocks.splice(i, 1, {
                ...blocks[i],
                status: `open${blocks[i].aroundBomb}` as Status,
                isChecked: true,
              });
            }
          }
        }

        blocks.splice(payload.blockIdx, 1, {
          ...blocks[payload.blockIdx],
          status: 'bombdeath',
        });

        return {
          ...state,
          blocks,
          gameStatus: { ...state.gameStatus, isOver: true },
        };
      }
      if (blocks[payload.blockIdx].aroundBomb !== 0) {
        blocks.splice(payload.blockIdx, 1, {
          ...blocks[payload.blockIdx],
          status: `open${blocks[payload.blockIdx].aroundBomb}` as Status,
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
              status: `open${blocks[idxList[i]].aroundBomb}` as Status,
            });
          } else if (
            blocks[idxList[i]].aroundBomb === 0 &&
            !blocks[idxList[i]].isChecked
          ) {
            blocks.splice(blocks[idxList[i]].blockIdx, 1, {
              ...blocks[idxList[i]],
              isChecked: true,
              status: `open${blocks[idxList[i]].aroundBomb}` as Status,
            });

            searchBlocks({ idxList: blocks[idxList[i]].searchableBlockIdx });
          } else if (blocks[idxList[i]].isMine) {
            blocks.splice(blocks[idxList[i]].blockIdx, 1, {
              ...blocks[idxList[i]],
              isChecked: true,
            });
          }
        }
      }
    },
    setFlag(state, { payload }: PayloadAction<{ blockIdx: number }>) {
      const blocks = [...state.blocks];

      blocks.splice(payload.blockIdx, 1, {
        ...blocks[payload.blockIdx],
        isThereFlag: !blocks[payload.blockIdx].isThereFlag,
        status: !blocks[payload.blockIdx].isThereFlag ? 'bombflagged' : 'blank',
      });
      return { ...state, blocks };
    },
    setGameStatus(
      state,
      {
        payload,
      }: PayloadAction<{ key: 'isComplete' | 'isOver'; value: boolean }>
    ) {
      return {
        ...state,
        gameStatus: { ...state.gameStatus, [payload.key]: payload.value },
      };
    },
  },
});

export const { setBlocks, checkBlock, setFlag, setGameStatus } = actions;
export default reducer;
