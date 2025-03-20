import { createContext } from "react";
import { Url } from "../../types/contexts";

interface context {
  history: Url[];
  setHistory: (history: Url[]) => void;
  removeItem: (uuid: string) => void;
  updateItem: (item: Url) => void;
}

export const HistoryContext = createContext<context>({
  history: [],
  setHistory: () => {},
  removeItem: () => {},
  updateItem: () => {},
});
