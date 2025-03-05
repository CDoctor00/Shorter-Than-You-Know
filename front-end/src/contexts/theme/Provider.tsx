import { useEffect, useState } from "react";
import { ThemeContext } from "./Context";

const attributeName = "data-theme";
const localStorageVariable = "site-theme";
const lightTheme = "light";
const darkTheme = "dark";

interface props {
  children: React.ReactNode;
}

const ThemeContextProvider = (props: props) => {
  const [theme, setTheme] = useState<undefined | string>();

  useEffect(() => {
    const lsTheme = window.localStorage.getItem(localStorageVariable);

    if (lsTheme === null) {
      // //? Checking the browser theme
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme(darkTheme);
      }
    } else {
      setTheme(lsTheme);
    }
  }, []);

  useEffect(() => {
    if (!theme) {
      return;
    }

    const htmlTag = document.getElementsByTagName("html")[0];
    htmlTag.setAttribute(attributeName, theme);
    window.localStorage.setItem(localStorageVariable, theme);
  }, [theme]);

  const themeSwitcher = () => {
    const htmlTag = document.getElementsByTagName("html")[0];

    const themeAttribute = htmlTag.getAttribute(attributeName);
    if (themeAttribute === lightTheme) {
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
