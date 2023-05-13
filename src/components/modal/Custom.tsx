import styled from 'styled-components';
import { ModalBkg } from '../../style/util';

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
function Custom({
  setVisibility,
}: {
  setVisibility: React.Dispatch<
    React.SetStateAction<{ custom: boolean; option: boolean }>
  >;
}) {
  const handleClose = () => {
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
            <ContentInput type="number"></ContentInput>
          </Content>
          <Content>
            Game width:
            <ContentInput type="number"></ContentInput>
          </Content>
          <Content>
            Number of Bombs: <ContentInput type="number"></ContentInput>
          </Content>
          <EnterButton>ENTER</EnterButton>
        </ContentSection>
      </Container>
    </ModalBkg>
  );
}

export default Custom;
