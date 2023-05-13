import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Block {
  isMine: boolean;
  isChecked: boolean;
  blockIdx: number;
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
          { value: payload.height + 1, idx: 2 },
          { value: payload.height, idx: 3 },
          { value: payload.height - 1, idx: 4 },
          { value: -1, idx: 5 },
          { value: -1 * (payload.height + 1), idx: 6 },
          { value: -1 * payload.height, idx: 7 },
          { value: -1 * (payload.height - 1), idx: 8 },
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

      return { ...state, blocks };
    },
  },
});

export const { setBlocks } = actions;
export default reducer;
