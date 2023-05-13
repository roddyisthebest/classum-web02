import styled from 'styled-components';

const Container = styled.button`
  padding: 0;
  width: 16px;
  height: 16px;
  background-color: transparent;
  border: none;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

function Block() {
  return (
    <Container>
      <Img src="https://freeminesweeper.org/images/blank.gif"></Img>
    </Container>
  );
}

export default Block;
