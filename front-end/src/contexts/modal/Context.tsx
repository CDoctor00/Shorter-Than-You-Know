import { createContext } from "react";

interface context {
  isOpen: boolean;
  toggleModal: () => void;
  children: React.ReactNode;
  setChildren: (child: React.ReactNode) => void;
}

export const ModalContext = createContext<context>({
  isOpen: false,
  toggleModal: () => {},
  children: null,
  setChildren: () => {},
});
