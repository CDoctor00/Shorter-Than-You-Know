import { createContext } from "react";

export interface url {
  longUrl: string;
  shortUrl: string;
  shortID: string;
  uuid?: string;
  isEnabled?: boolean;
  status?: string;
  createTime?: Date;
  updateTime?: Date;
  expirationTime?: Date;
  prefix?: string;
  note?: string;
  clicks?: number;
}

interface context {
  url: url | undefined;
  isNew: boolean;
  setUrl: (newUrl: url | undefined, isNew: boolean) => void;
}

export const UrlContext = createContext<context>({
  url: undefined,
  isNew: true,
  setUrl: () => {},
});
