import { configureStore } from '@reduxjs/toolkit';
import SettingReducer, { Setting } from './setting';
import DataReducer, { Data } from './data';

export interface InitialState {
  setting: Setting;
  data: Data;
}
export default configureStore({
  reducer: {
    setting: SettingReducer,
    data: DataReducer,
  },
});
