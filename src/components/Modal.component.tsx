import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import styled from "styled-components";
import { FlexSeperate } from "../styles/index.style";

const Modal = ({visible, setVisible}: {visible: {
    url: string;
    show: boolean;
}; setVisible: React.Dispatch<React.SetStateAction<{
    url: string;
    show: boolean;
}>>}) => {
  const [wrapper, setWrapper] = useState(false);
  const [container, setContainer] = useState(false);

  useEffect(() => {
    if (!visible) {
      setWrapper(visible);
      setTimeout(() => {
        setWrapper(visible);
        setContainer(visible);
      }, 100);
    } else {
      setContainer(visible.show);
      setTimeout(() => {
        setContainer(visible.show);
        setWrapper(visible.show);
      }, 100);
    }
  }, [visible]);

  const getName = (url: string) => {
    try{
        return url.split("/")[4].split("%2").pop()
    }catch(e){
        return ""
    }
  }

  return (
    <ModalContainer
      props={{ visible: container }}
      onClick={() => setVisible(e=> ({...e, show: false}))}
    >
      <ModalWrapper
        props={{ visible: container, wrapper }}
        onClick={(e) => e.stopPropagation()}
      >
        <FlexSeperate>
        <Header>
          {getName(visible.url)}
        </Header>
        <IoCloseSharp
            color={"##7f7f7f"}
            style={{ cursor: "pointer", marginLeft: 10 }}
            onClick={() => setVisible(e=> ({...e, show: false}))}
          />
          </FlexSeperate>
        <Title>Details</Title>
        <Figure>fracture</Figure>
        <div style={{position: 'relative'}}>
        <img
          src={visible.url.replace("thumbnails", "images")}
          alt={"Image"}
          style={{ width: 400, height: 400 }}
        />
        </div>
      </ModalWrapper>
    </ModalContainer>
  );
};

const Header = styled.h4`
  font-family: "Montserrat";
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 350px;
`;

const Title = styled.span`
  font-family: "Montserrat";
  font-size: 12px;
  font-weight: 300;
  line-height: 15px;
  letter-spacing: 0em;
  text-align: left;
`;

const Figure = styled.div`
  width: 96.39px;
  padding: 3px 5px;
  border-radius: 12px;
  background-color: #ffd75c;
  margin: 10px 0;
`;

interface IModalContainer {
  props?: {
    visible: boolean;
  };
}

export const ModalContainer = styled.div<IModalContainer>`
  position: fixed;
  display: ${({ props }) => (props?.visible ? "flex" : "none")};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(2.5px);
  background-color: ${({ props }) =>
    props?.visible ? "rgba(0, 0, 0, 0.6)" : "transparent"};
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 999;
  transition: all 0.25s ease-in-out;
`;

interface IModalWrapper {
  props?: {
    visible: boolean;
    wrapper: boolean;
  };
}

export const ModalWrapper = styled.div<IModalWrapper>`
  max-width: 50%;
  max-height: 80%;
  height: max-content;
  width: max-content;
  border-radius: 5px;
  padding: 2.5%;
  opacity: ${({ props }) => (props?.visible ? 1 : 0)};
  background-color: white;
  /* overflow: hidden; */
  transition: all 0.25s ease-in-out;
  transform: ${({ props }) => (props?.wrapper ? "scale(1)" : "scale(0)")};

  @media (max-width: 768px) {
    max-width: 90%;
    max-height: 90%;
  }
`;
export default Modal;
