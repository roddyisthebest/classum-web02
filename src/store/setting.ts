import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Setting {
  layout: {
    width: number;
    height: number;
  };
  bomb: number;
}

export type Difficulty = 'beginner' | 'intermediate' | 'expert';

// 게임의 설정값에 대한 스토어 - setting

const { actions, reducer } = createSlice({
  name: 'setting',
  initialState: {
    layout: {
      width: 8,
      height: 8,
    },
    bomb: 10,
  } as Setting,
  reducers: {
    //  난이도를 기반으로 게임의 설정값 중 가로, 세로 레이아웃을 설정하는 리듀서입니다.
    setLayoutDefault(
      state,
      {
        payload,
      }: PayloadAction<{
        difficulty: Difficulty;
      }>
    ) {
      const layout = { ...state.layout };
      let bomb;
      if (payload.difficulty === 'beginner') {
        layout.height = 8;
        layout.width = 8;
        bomb = 10;
      } else if (payload.difficulty === 'intermediate') {
        layout.height = 16;
        layout.width = 16;
        bomb = 40;
      } else {
        layout.height = 16;
        layout.width = 32;
        bomb = 99;
      }

      return {
        ...state,
        layout,
        bomb,
      };
    },
    //  사용자 설정값으로 게임의 설정값 중 가로, 세로 레이아웃을 설정하는 리듀서입니다.
    setLayoutCustom(
      state,
      {
        payload,
      }: PayloadAction<{
        width: number;
        height: number;
        bomb: number;
      }>
    ) {
      return {
        ...state,
        layout: { width: payload.width, height: payload.height },
        bomb: payload.bomb,
      };
    },
  },
});

export const { setLayoutDefault, setLayoutCustom } = actions;
export default reducer;
