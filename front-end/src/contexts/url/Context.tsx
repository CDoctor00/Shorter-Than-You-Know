import { createContext } from "react";
import { Url } from "../../types/contexts";

interface context {
  url: Url | undefined;
  isNew: boolean;
  setUrl: (newUrl: Url | undefined, isNew: boolean) => void;
  showForm: boolean;
  setShowForm: (value: boolean) => void;
}

export const UrlContext = createContext<context>({
  url: undefined,
  isNew: true,
  setUrl: () => {},
  showForm: true,
  setShowForm: () => {},
});
