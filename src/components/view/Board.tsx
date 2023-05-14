import styled from 'styled-components';
import Block from '../card/Block';
import { AiOutlineCheck } from 'react-icons/ai';
import { useState } from 'react';
import Custom from '../modal/Custom';
import { InitialState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { Difficulty, setLayoutDefault } from '../../store/setting';
import { setBlocks } from '../../store/data';
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
  position: relative;
`;
const MenuButton = styled.button`
  border: none;
  background-color: transparent;
  color: black;
  font-size: 13px;
  padding: 0;
  cursor: pointer;
`;

const OptionsListWrapper = styled.div`
  position: absolute;
  padding: 2.5px;
  border-right: 2px solid #2c2c2c;
  border-bottom: 2px solid #2c2c2c;
  border-left: 2px solid #808080;
  border-top: 2px solid #808080;
  z-index: 5;
  background-color: #bdbdbd;
  top: 30px;
`;

const OptionsList = styled.div`
  border-right: 2px solid #808080;
  border-bottom: 2px solid #808080;
  border-left: 2px solid #2c2c2c;
  border-top: 2px solid #2c2c2c;
  display: flex;
  flex-direction: column;
`;

const OptionButton = styled.button`
  width: 90px;
  height: 20px;
  border: none;
  display: flex;
  gap: 0 5px;
  align-items: center;
  background-color: transparent;
  color: black;
  font-size: 10px;
  &:hover {
    color: blue;
  }
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

const ResetButton = styled.button<{
  isOver: boolean;
}>`
  width: 30px;
  height: 30px;
  background-color: transparent;
  padding: 0;
  border: none;
  background-image: ${(props) =>
    props.isOver
      ? `url('https://freeminesweeper.org/images/facedead.gif')`
      : `url('https://freeminesweeper.org/images/facesmile.gif')`};
  background-position: center center;
  background-size: contain;
  cursor: pointer;
`;

const BlockSection = styled.div<{ width: number; height: number }>`
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  border-top: 2px solid #7e7e7e;
  width: ${(props) => `${props.width * 16}px`};
  height: ${(props) => `${props.height * 16}px`};

  border-left: 2px solid #7e7e7e;
  display: flex;
  flex-wrap: wrap;
`;

function Board() {
  const dispatch = useDispatch();
  const setting = useSelector((state: InitialState) => state.setting);
  const data = useSelector((state: InitialState) => state.data);

  const [visibility, setVisiblity] = useState<{
    option: boolean;
    custom: boolean;
  }>({
    option: false,
    custom: false,
  });

  const handleOption = ({ difficulty }: { difficulty: Difficulty }) => {
    dispatch(
      setLayoutDefault({
        difficulty,
      })
    );
    dispatch(
      setBlocks({
        width: setting.layout.width,
        height: setting.layout.width,
        bomb: setting.bomb,
      })
    );

    setVisiblity((prev) => ({ ...prev, option: false }));
  };

  const onClickResetBtn = () => {
    dispatch(
      setBlocks({
        width: setting.layout.width,
        height: setting.layout.width,
        bomb: setting.bomb,
      })
    );
  };

  const onClickCustom = () => {
    setVisiblity((prev) => ({ option: false, custom: true }));
  };

  return (
    <Container>
      <MenuSection>
        <MenuButton
          onClick={() =>
            setVisiblity((prev) => ({ ...prev, option: !prev.option }))
          }
        >
          Game
        </MenuButton>
        {visibility.option && (
          <OptionsListWrapper>
            <OptionsList>
              <OptionButton style={{ borderBottom: '2px solid black' }}>
                New
              </OptionButton>
              <OptionButton
                onClick={() => handleOption({ difficulty: 'beginner' })}
              >
                Beginner
              </OptionButton>
              <OptionButton
                onClick={() => handleOption({ difficulty: 'intermediate' })}
              >
                Intermediate
              </OptionButton>
              <OptionButton
                onClick={() => handleOption({ difficulty: 'expert' })}
              >
                Expert
              </OptionButton>
              <OptionButton onClick={onClickCustom}>Custom</OptionButton>
            </OptionsList>
          </OptionsListWrapper>
        )}
      </MenuSection>
      <ContentSection>
        <Header>
          <Indicator>
            <IndicatorText>000</IndicatorText>
          </Indicator>
          <ResetButton isOver={false} onClick={onClickResetBtn}></ResetButton>
          <Indicator>
            <IndicatorText>000</IndicatorText>
          </Indicator>
        </Header>
        <BlockSection
          width={setting.layout.width}
          height={setting.layout.height}
        >
          {data.blocks.map((block) => (
            <Block key={block.blockIdx} data={block}></Block>
          ))}
        </BlockSection>
      </ContentSection>
      {visibility.custom && <Custom setVisibility={setVisiblity}></Custom>}
    </Container>
  );
}

export default Board;
