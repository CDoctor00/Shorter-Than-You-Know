import { useState } from "react";
import { HistoryContext } from "./Context";
import { Url } from "../../types/contexts";

interface props {
  children: React.ReactNode;
}

const HistoryContextProvider = (props: props) => {
  const [history, setHistory] = useState<Url[]>([]);

  const removeItem = (uuid: string) => {
    setHistory(
      history.filter((item: Url) => {
        return item.uuid !== uuid;
      })
    );
  };

  const updateItem = (newItem: Url) => {
    const newHistory = history.map((item: Url) => {
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
