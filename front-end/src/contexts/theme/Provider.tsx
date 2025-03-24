import { useEffect, useState } from "react";
import { ThemeContext } from "./Context";
import { localStorageManager } from "../../services/system/local_storage";

const attributeName = "data-theme";
const lightTheme = "light";
const darkTheme = "dark";

interface props {
  children: React.ReactNode;
}

const ThemeContextProvider = (props: props) => {
  const [theme, setTheme] = useState<undefined | string>(() => {
    const lsTheme = localStorageManager.getTheme();

    if (lsTheme === null) {
      // //? Checking the browser theme
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return darkTheme;
      }
    } else {
      return lsTheme;
    }
  });

  useEffect(() => {
    if (!theme) {
      return;
    }

    const htmlTag = document.getElementsByTagName("html")[0];
    htmlTag.setAttribute(attributeName, theme);
    localStorageManager.setTheme(theme);
  }, [theme]);

  const themeSwitcher = () => {
    if (theme === lightTheme) {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ isLightTheme: theme === lightTheme, themeSwitcher }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
