import styled from 'styled-components';
import {
  Block as BlockType,
  checkBlock,
  setFlag,
  setGameStatus,
} from '../../store/data';
import { Status } from '../../store/data';
import { useDispatch, useSelector } from 'react-redux';
import { InitialState } from '../../store';

const Container = styled.button<{ status: Status }>`
  padding: 0;
  width: 16px;
  height: 16px;
  border: none;
  background-image: ${(props) =>
    `url(https://freeminesweeper.org/images/${props.status}.gif)`};
`;

function Block({ data }: { data: BlockType }) {
  const dispatch = useDispatch();

  const isInProgress = useSelector(
    (state: InitialState) => state.data.gameStatus.isInProgress
  );
  const setting = useSelector((state: InitialState) => state.setting);
  return (
    <Container
      disabled={data.isChecked}
      status={data.status}
      onClick={() => {
        if (!data.isThereFlag) {
          dispatch(
            checkBlock({
              blockIdx: data.blockIdx,
              width: setting.layout.width,
              height: setting.layout.height,
              bomb: setting.bomb,
            })
          );
        }
        if (!isInProgress) {
          dispatch(setGameStatus({ key: 'isInProgress', value: true }));
        }
      }}
      onContextMenu={(e) => {
        if (!data.isChecked) {
          e.preventDefault();
          dispatch(setFlag({ blockIdx: data.blockIdx }));
        }
      }}
    ></Container>
  );
}

export default Block;
