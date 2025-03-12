import { createContext } from "react";

export interface url {
  longURL: string;
  shortenURL: string;
  status?: string;
  createdTime?: string;
  lastUpdateTime?: string;
  prefix?: string;
  expirationTime?: string;
  password?: string;
  note?: string;
  clicks?: number;
}

interface context {
  url: url | undefined;
  setURL: (newUrl: url | undefined) => void;
}

export const UrlContext = createContext<context>({
  url: undefined,
  setURL: () => {},
});
