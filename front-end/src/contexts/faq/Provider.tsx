import { useState } from "react";
import { FaqContext } from "./Context";

interface props {
  children: React.ReactNode;
}

const FaqContextProvider = (props: props) => {
  const [activeItem, setActiveItem] = useState(-1);

  const changeActiveItem = (newIndex: number) => {
    if (activeItem === newIndex) {
      setActiveItem(-1);
    } else {
      setActiveItem(newIndex);
    }
  };

  return (
    <FaqContext.Provider
      value={{ activeItem, setActiveItem: changeActiveItem }}
    >
      {props.children}
    </FaqContext.Provider>
  );
};

export default FaqContextProvider;
