import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import createBlocks from '../util/func/createBlocks';

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
    isInProgress: boolean;
  };
}

const { actions, reducer } = createSlice({
  name: 'data',
  initialState: {
    blocks: [] as Block[],
    gameStatus: {
      isOver: false,
      isComplete: false,
      isInProgress: false,
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
      const blocks: Block[] = createBlocks({
        width: payload.width,
        height: payload.height,
        bomb: payload.bomb,
        blockIdx: -1,
      });

      return {
        ...state,
        blocks,
        gameStatus: {
          isOver: false,
          isComplete: false,
          isInProgress: false,
        },
      };
    },
    checkBlock(
      state,
      {
        payload,
      }: PayloadAction<{
        blockIdx: number;
        width: number;
        height: number;
        bomb: number;
      }>
    ) {
      let blocks = [...state.blocks];

      if (blocks[payload.blockIdx].isMine && !state.gameStatus.isInProgress) {
        console.log('처음인데 폭탄!');
        const newBlocks: Block[] = createBlocks({
          width: payload.width,
          height: payload.height,
          bomb: payload.bomb,
          blockIdx: payload.blockIdx,
        });

        blocks = [...newBlocks];
      }

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
          gameStatus: {
            ...state.gameStatus,
            isOver: true,
            isInProgress: false,
          },
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
      }: PayloadAction<{
        key: 'isComplete' | 'isOver' | 'isInProgress';
        value: boolean;
      }>
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
