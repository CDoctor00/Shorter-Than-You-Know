import { createContext } from "react";

interface context {
  shortenURL: string;
  setShortenURL: (newUrl: string) => void;
}

export const UrlContext = createContext<context>({
  shortenURL: "",
  setShortenURL: () => {},
});
