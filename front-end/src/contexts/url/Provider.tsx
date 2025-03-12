import { useState } from "react";
import { url, UrlContext } from "./Context";

interface props {
  children: React.ReactNode;
}

const UrlContextProvider = (props: props) => {
  const [url, setURL] = useState<url>();

  return (
    <UrlContext.Provider value={{ url, setURL }}>
      {props.children}
    </UrlContext.Provider>
  );
};

export default UrlContextProvider;
