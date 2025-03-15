import { useState } from "react";
import { url } from "../url/Context";
import { HistoryContext } from "./Context";

interface props {
  children: React.ReactNode;
}

const HistoryContextProvider = (props: props) => {
  const [history, setHistory] = useState<url[]>([]);

  const removeItem = (uuid: string) => {
    setHistory(
      history.filter((item: url) => {
        return item.uuid !== uuid;
      })
    );
  };

  const updateItem = (newItem: url) => {
    const newHistory = history.map((item: url) => {
      if (item.uuid === newItem.uuid) {
        return newItem;
      }
      return item;
    });

    setHistory(newHistory);
  };

  return (
    <HistoryContext.Provider
      value={{ history, setHistory, removeItem, updateItem }}
    >
      {props.children}
    </HistoryContext.Provider>
  );
};

export default HistoryContextProvider;
