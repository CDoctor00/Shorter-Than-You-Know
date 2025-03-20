import { useState } from "react";
import { UrlContext } from "./Context";
import { Url } from "../../types/contexts";

interface props {
  children: React.ReactNode;
}

const UrlContextProvider = (props: props) => {
  const [url, setURL] = useState<Url>();
  const [isNew, setIsNew] = useState(true);

  const updateStates = (newUrl: Url | undefined, isNew: boolean) => {
    setURL(newUrl);
    setIsNew(isNew);
  };

  return (
    <UrlContext.Provider value={{ url, isNew, setUrl: updateStates }}>
      {props.children}
    </UrlContext.Provider>
  );
};

export default UrlContextProvider;
