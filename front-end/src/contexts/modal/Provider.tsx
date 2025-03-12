import { useState } from "react";
import { ModalContext } from "./Context";

interface props {
  children: React.ReactNode;
}

const ModalContextProvider = (props: props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<React.ReactNode>(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, toggleModal, children, setChildren }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export default ModalContextProvider;
