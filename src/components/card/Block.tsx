import styled from 'styled-components';
import { Block as BlockType, checkBlock, setFlag } from '../../store/data';
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
        if (!data.isThereFlag) {
          dispatch(checkBlock({ blockIdx: data.blockIdx }));
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
