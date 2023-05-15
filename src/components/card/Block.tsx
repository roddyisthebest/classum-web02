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

  const setting = useSelector((state: InitialState) => state.setting);
  const isComplete = useSelector(
    (state: InitialState) => state.data.gameStatus.isComplete
  );
  return (
    <Container
      disabled={data.isChecked || data.isThereFlag || isComplete}
      status={data.status}
      onClick={() => {
        dispatch(
          checkBlock({
            blockIdx: data.blockIdx,
            width: setting.layout.width,
            height: setting.layout.height,
            bomb: setting.bomb,
          })
        );
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
