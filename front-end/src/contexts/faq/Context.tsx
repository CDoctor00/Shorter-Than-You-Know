import { createContext } from "react";

interface context {
  activeItem: number;
  setActiveItem: (newIndex: number) => void;
}

export const FaqContext = createContext<context>({
  activeItem: -1,
  setActiveItem: () => {},
});
