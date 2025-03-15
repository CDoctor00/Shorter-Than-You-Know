import { createContext } from "react";
import { url } from "../url/Context";

interface context {
  history: url[];
  setHistory: (history: url[]) => void;
  removeItem: (uuid: string) => void;
  updateItem: (item: url) => void;
}

export const HistoryContext = createContext<context>({
  history: [],
  setHistory: () => {},
  removeItem: () => {},
  updateItem: () => {},
});
