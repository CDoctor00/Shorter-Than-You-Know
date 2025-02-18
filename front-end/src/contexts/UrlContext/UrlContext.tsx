import { createContext } from "react";

// const UrlContext = createContext();
const UrlContext = createContext({
  shortenURL: "",
  setShortenURL: (newValue: string) => {},
});

export default UrlContext;
