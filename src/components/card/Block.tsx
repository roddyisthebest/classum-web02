import styled from 'styled-components';
import { Block as BlockType, checkBlock, setFlag } from '../../store/data';
import { Status } from '../../store/data';
import { useDispatch, useSelector } from 'react-redux';
import { InitialState } from '../../store';
import { memo } from 'react';
const Container = styled.button<{ status: Status }>`
  padding: 0;
  width: 16px;
  height: 16px;
  border: none;
  background-image: ${(props) =>
    `url(https://freeminesweeper.org/images/${props.status}.gif)`};
`;

// 지뢰찾기 게임의 한 블록을 담당하는 블록 컴포넌트 입니다.

function Block({ data }: { data: BlockType }) {
  const dispatch = useDispatch();

  const setting = useSelector((state: InitialState) => state.setting);
  const isComplete = useSelector(
    (state: InitialState) => state.data.gameStatus.isComplete
  );
  return (
    <Container
      // 블록이 체크 되었거나 플레그 표시를 했거나, 또는 게임이 완료되었을 경우에는 클릭을 못하게 막아놓았습니다.
      disabled={data.isChecked || data.isThereFlag || isComplete}
      // 블록의 status에 따라 이미지가 변경되도록 구현하였습니다.
      status={data.status}
      // 마우스 왼쪽 버튼을 클릭하면 checkBlock함수를 통해 블록값을 체크합니다.
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
      // 마우스 오른쪽 버튼을 클릭하면 버튼의 플레그 표시를 토글할 수 있습니다.
      onContextMenu={(e) => {
        if (!data.isChecked && !isComplete) {
          e.preventDefault();
          dispatch(setFlag({ blockIdx: data.blockIdx }));
        }
      }}
    ></Container>
  );
}

export default memo(Block);
