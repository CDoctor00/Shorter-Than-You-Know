import { useState } from "react";
import { url, UrlContext } from "./Context";

interface props {
  children: React.ReactNode;
}

const UrlContextProvider = (props: props) => {
  const [url, setURL] = useState<url>();
  const [isNew, setIsNew] = useState(true);

  const updateStates = (newUrl: url | undefined, isNew: boolean) => {
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
