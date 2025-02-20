import { createContext } from "react";

interface context {
  shortenURL: string;
  setShortenURL: (newUrl: string) => void;
}

// const UrlContext = createContext();
const UrlContext = createContext<context>({
  shortenURL: "",
  setShortenURL: () => {},
});

export default UrlContext;
