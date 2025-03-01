import { createContext } from "react";

interface context {
  isLightTheme: boolean;
  themeSwitcher: () => void;
}

export const ThemeContext = createContext<context>({
  isLightTheme: true,
  themeSwitcher: () => {},
});
