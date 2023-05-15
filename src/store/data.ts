import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

// 전체적인 게임 데이터(블록들, 게임상태)에 대한 스토어 - data

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
    // 블록들을 세팅하는 리듀서입니다.
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
      // util함수 createBlocks를 사용하여 block 배열을 받아 블록들을 세팅합니다.
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
    // 블록을 체크하는 리듀서입니다.
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

      // 처음 블록을 클릭하였는데 그 블록이 지뢰라면
      // 블록을 다시 세팅합니다. (클릭된 블록의 idx를 제외하여 지뢰 세팅)
      // 다시 세팅한 블록들을 기반으로 기존에 클릭한 블록을 체크하며 게임이 진행됩니다.
      if (blocks[payload.blockIdx].isMine && !state.gameStatus.isInProgress) {
        const newBlocks: Block[] = createBlocks({
          width: payload.width,
          height: payload.height,
          bomb: payload.bomb,
          blockIdx: payload.blockIdx,
        });

        blocks = [...newBlocks];
      }

      // 블록을 체크합니다.
      blocks.splice(payload.blockIdx, 1, {
        ...blocks[payload.blockIdx],
        isChecked: true,
      });

      // 클릭한 블록이 지뢰라면
      if (blocks[payload.blockIdx].isMine) {
        // 모든 블록을 체크하여 모든블록에 상태값을 적용하고 게임을 종료합니다. (클릭된 블록 제외)
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
      // 클릭한 블록 주위에 폭탄이 있다면
      if (blocks[payload.blockIdx].aroundBomb !== 0) {
        // 블록에 상태값을 적용합니다.
        blocks.splice(payload.blockIdx, 1, {
          ...blocks[payload.blockIdx],
          status: `open${blocks[payload.blockIdx].aroundBomb}` as Status,
        });

        return {
          ...state,
          blocks,
          gameStatus: { ...state.gameStatus, isInProgress: true },
        };
      }
      // 클릭한 블록 주위에 폭탄이 없다면
      else {
        // 블록에 상태값을 적용하고
        blocks.splice(payload.blockIdx, 1, {
          ...blocks[payload.blockIdx],
          status: 'open0',
        });

        // searchBlocks 함수를 통해 탐색을 시작합니다.
        searchBlocks({ idxList: blocks[payload.blockIdx].searchableBlockIdx });

        const clickedBlocks = blocks.filter((block) => block.isChecked);

        // 이 게임은 블록을 누른 후 시작됩니다.
        // 블록을 처음 눌렀는데 게임이 완료되는 상황이라면
        // game상태를 완료로 세팅하고 게임을 완료합니다.
        if (
          !state.gameStatus.isInProgress &&
          blocks.length - clickedBlocks.length === payload.bomb
        ) {
          return {
            ...state,
            blocks,
            gameStatus: { ...state.gameStatus, isComplete: true },
          };
        }
        // 게임이 시작된 상황이 아니라면 게임을 진행중으로 세팅합니다.
        else if (!state.gameStatus.isInProgress) {
          return {
            ...state,
            blocks,
            gameStatus: { ...state.gameStatus, isInProgress: true },
          };
        }

        return { ...state, blocks };
      }

      // "만약 클릭한 블록 주변에 지뢰가 하나도 존재하지 않는다면
      // 그 블록에는 숫자가 나타나지 않으며, 지뢰가 없는 인접한 칸들이 자동으로 열리게 됩니다."
      // 위 룰을 지키기 위해 구현된 함수입니다.
      // 이 함수는 인접한 칸에 지뢰가 없는 블록을 대상으로 실행됩니다.
      function searchBlocks({ idxList }: { idxList: number[] }) {
        // 인수로 한 블록을 기준으로 접근이 가능한 블록들의 idxList를 받습니다.

        // 접근 가능한 블록을 탐색합니다.
        for (let i = 0; i < idxList.length; i++) {
          // 접근 가능한 블록 중 폭탄이 아니지만

          //주위의 폭탄 갯수가 있다면
          if (blocks[idxList[i]].aroundBomb !== 0) {
            // 주위블록 갯수를 기반으로 블록의 상태값을 openN, 체크된 상태라고 변경합니다.
            blocks.splice(blocks[idxList[i]].blockIdx, 1, {
              ...blocks[idxList[i]],
              isChecked: true,
              status: `open${blocks[idxList[i]].aroundBomb}` as Status,
            });
          }
          // 주위의 폭탄갯수가 없고 체크된 블록이 아니라면
          else if (
            blocks[idxList[i]].aroundBomb === 0 &&
            !blocks[idxList[i]].isChecked
          ) {
            // 블록의 상태값을 open0, 체크된 상태라고 변경하고
            blocks.splice(blocks[idxList[i]].blockIdx, 1, {
              ...blocks[idxList[i]],
              isChecked: true,
              status: `open${blocks[idxList[i]].aroundBomb}` as Status,
            });

            // 이 블록의 접근가능한 블록들의 idxList를 인수로 받아 또 searchBlocks을 실행합니다.
            searchBlocks({ idxList: blocks[idxList[i]].searchableBlockIdx });
          }
        }
      }
    },
    // 특정 블록의 플래그 값을 세팅하는 리듀서입니다.
    setFlag(state, { payload }: PayloadAction<{ blockIdx: number }>) {
      const blocks = [...state.blocks];

      blocks.splice(payload.blockIdx, 1, {
        ...blocks[payload.blockIdx],
        isThereFlag: !blocks[payload.blockIdx].isThereFlag,
        status: !blocks[payload.blockIdx].isThereFlag ? 'bombflagged' : 'blank',
      });
      return { ...state, blocks };
    },
    // 게임의 상태를 세팅하는 리듀서입니다.
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
