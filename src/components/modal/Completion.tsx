import styled from 'styled-components';
import { ModalBkg } from '../../util/style';
import { useDispatch, useSelector } from 'react-redux';
import { setBlocks, setGameStatus } from '../../store/data';
import { InitialState } from '../../store';

const HeaderSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 15px 0;
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
  display: flex;
  flex-direction: column;
  gap: 10px 0;
`;

const ContentText = styled.span`
  color: black;
  font-size: 15px;
`;

function Completion({
  setVisibility,
}: {
  setVisibility: React.Dispatch<
    React.SetStateAction<{
      custom: boolean;
      option: boolean;
      completion: boolean;
    }>
  >;
}) {
  const setting = useSelector((state: InitialState) => state.setting);
  const handleClose = () => {
    setVisibility((prev) => ({ ...prev, completion: false }));
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
          <HeaderText>YOU DID IT!</HeaderText>
          <CloseButton onClick={handleClose}>CLOSE</CloseButton>
        </HeaderSection>
        <ContentSection>
          <ContentText>Congratulations on winning Minesweeper</ContentText>

          <ContentText>
            Game parameters: {setting.layout.width}x{setting.layout.height}
            dimension / {setting.bomb}
            bombs
          </ContentText>
        </ContentSection>
      </Container>
    </ModalBkg>
  );
}

export default Completion;
