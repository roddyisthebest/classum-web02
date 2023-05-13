import styled from 'styled-components';
import {
  Block as BlockType,
  checkBlock,
  setAroundBomb,
} from '../../store/data';
import { Status } from '../../store/data';
import { useDispatch } from 'react-redux';

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

  return (
    <Container
      disabled={data.isChecked}
      status={data.status}
      onClick={() => {
        dispatch(checkBlock({ blockIdx: data.blockIdx }));
      }}
    ></Container>
  );
}

export default Block;
