import styled from 'styled-components';

const Container = styled.button`
  padding: 0;
  width: 16px;
  height: 16px;
  background-color: transparent;
  border: none;
  background-image: url('https://freeminesweeper.org/images/blank.gif');
`;

function Block() {
  return <Container></Container>;
}

export default Block;
