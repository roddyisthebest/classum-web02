import styled from 'styled-components';
import Block from './Block';
const Container = styled.div`
  border-radius: 10px;

  background-color: #c0c0c0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px 0;
`;

const MenuSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0 15px;
`;
const MenuButton = styled.button`
  border: none;
  background-color: transparent;
  color: black;
  font-size: 13px;
  padding: 0;
  cursor: pointer;
`;

const ContentSection = styled.div`
  border-left: 2px solid #ffffff;
  border-top: 2px solid #ffffff;
  border-right: 2px solid #7e7e7e;
  border-bottom: 2px solid #7e7e7e;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px 0;
`;

const Header = styled.div`
  height: 30px;
  display: flex;
  justify-content: space-between;
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  border-left: 2px solid #7e7e7e;
  border-top: 2px solid #7e7e7e;
`;

const Indicator = styled.div`
  width: 50px;
  height: 100%;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const IndicatorText = styled.span`
  color: #f30201;
  font-size: 18px;
  font-weight: 600;
`;

const ResetButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: transparent;
  padding: 0;
  border: none;
  background-image: url('https://freeminesweeper.org/images/facesmile.gif');
  background-position: center center;
  background-size: contain;
`;

const BlockSection = styled.div`
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  border-top: 2px solid #7e7e7e;
  width: 160px;
  height: 160px;
  border-left: 2px solid #7e7e7e;
  display: flex;
  flex-wrap: wrap;
`;

function Board() {
  return (
    <Container>
      <MenuSection>
        <MenuButton>Game</MenuButton>
      </MenuSection>
      <ContentSection>
        <Header>
          <Indicator>
            <IndicatorText>000</IndicatorText>
          </Indicator>
          <ResetButton></ResetButton>
          <Indicator>
            <IndicatorText>000</IndicatorText>
          </Indicator>
        </Header>
        <BlockSection>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>

          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>

          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
          <Block></Block>
        </BlockSection>
      </ContentSection>
    </Container>
  );
}

export default Board;
