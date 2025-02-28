import { useState } from "react";
import { UrlContext } from "./Context";

interface props {
  children: React.ReactNode;
}

const UrlContextProvider = (props: props) => {
  const [shortenURL, setShortenURL] = useState("");

  return (
    <UrlContext.Provider value={{ shortenURL, setShortenURL }}>
      {props.children}
    </UrlContext.Provider>
  );
};

export default UrlContextProvider;
