import styled from 'styled-components';
import { ModalBkg } from '../../util/style';
import { useState } from 'react';
import { Setting, setLayoutCustom } from '../../store/setting';
import { useDispatch } from 'react-redux';
import { setBlocks } from '../../store/data';

const Container = styled.div`
  width: 400px;
  height: 250px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const HeaderSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderText = styled.span`
  color: black;
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  padding: 5px;

  border: none;
  background-color: black;
  color: white;
  font-weight: 500;
`;
const ContentSection = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 10px 0;
`;

const Content = styled.div`
  display: flex;

  gap: 0 10px;
  align-items: center;
  font-size: 18px;
  color: black;
`;

const ContentInput = styled.input`
  width: 50px;
`;

const EnterButton = styled.button`
  padding: 5px;

  border: none;
  background-color: black;
  color: white;
  font-weight: 500;
  width: 100px;
`;
function CustomSetting({
  setVisibility,
}: {
  setVisibility: React.Dispatch<
    React.SetStateAction<{
      custom: boolean;
      option: boolean;
    }>
  >;
}) {
  const dispatch = useDispatch();
  const [setting, setSetting] = useState<Setting>({
    layout: {
      width: 60,
      height: 30,
    },
    bomb: 99,
  });

  const handleClose = () => {
    setVisibility((prev) => ({ ...prev, custom: false }));
  };

  const handleEnter = () => {
    if (
      !(
        setting.layout.width > 8 &&
        setting.layout.width <= 100 &&
        setting.layout.height > 8 &&
        setting.layout.height <= 100 &&
        setting.bomb <= (setting.layout.width * setting.layout.height) / 2 &&
        setting.bomb > 0
      )
    ) {
      alert(
        '지뢰찾기 dimensions invalid:\n1.width:From 8 to 100\n2.height:From 8 to 100\n3.Bomb:1 to 1/2 of width*height'
      );
      setSetting({
        layout: {
          width: 60,
          height: 30,
        },
        bomb: 99,
      });
      return;
    }

    dispatch(
      setLayoutCustom({
        width: setting.layout.width,
        height: setting.layout.height,
        bomb: setting.bomb,
      })
    );

    dispatch(
      setBlocks({
        width: setting.layout.width,
        height: setting.layout.height,
        bomb: setting.bomb,
      })
    );
    setVisibility((prev) => ({ ...prev, custom: false }));
  };

  return (
    <ModalBkg
      id="modalBkg"
      onClick={(e: any) => {
        if (e.target.id === 'modalBkg') {
          handleClose();
        }
      }}
    >
      <Container>
        <HeaderSection>
          <HeaderText>Custom Game Setup</HeaderText>
          <CloseButton onClick={handleClose}>CLOSE</CloseButton>
        </HeaderSection>
        <ContentSection>
          <Content>
            Game Height:
            <ContentInput
              type="number"
              value={setting.layout.height}
              onChange={(e) => {
                setSetting((prev) => ({
                  ...prev,
                  layout: {
                    ...prev.layout,
                    height: parseInt(e.target.value, 10),
                  },
                }));
              }}
            ></ContentInput>
          </Content>
          <Content>
            Game width:
            <ContentInput
              type="number"
              value={setting.layout.width}
              onChange={(e) => {
                setSetting((prev) => ({
                  ...prev,
                  layout: {
                    ...prev.layout,
                    width: parseInt(e.target.value, 10),
                  },
                }));
              }}
            ></ContentInput>
          </Content>
          <Content>
            Number of Bombs:
            <ContentInput
              type="number"
              value={setting.bomb}
              onChange={(e) => {
                setSetting((prev) => ({
                  ...prev,
                  bomb: parseInt(e.target.value, 10),
                }));
              }}
            ></ContentInput>
          </Content>
          <EnterButton onClick={handleEnter}>ENTER</EnterButton>
        </ContentSection>
      </Container>
    </ModalBkg>
  );
}

export default CustomSetting;
