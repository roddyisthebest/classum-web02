import styled from 'styled-components';
import Board from './components/view/Board';
const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
`;
function App() {
  return (
    <Container className="App">
      <Board></Board>
    </Container>
  );
}

export default App;
