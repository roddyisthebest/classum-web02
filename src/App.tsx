import styled from 'styled-components';
import Board from './components/view/Board';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InitialState } from './store';
import { setBlocks } from './store/data';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
`;
function App() {
  const setting = useSelector((state: InitialState) => state.setting);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBlocks({
        width: setting.layout.width,
        height: setting.layout.height,
        bomb: setting.bomb,
      })
    );
  }, [dispatch, setting]);

  return (
    <Container className="App">
      <Board></Board>
    </Container>
  );
}

export default App;
