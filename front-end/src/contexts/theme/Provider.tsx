import { useEffect, useState } from "react";
import { ThemeContext } from "./Context";

const themeAttribute = "data-theme";
const localStorageVariable = "site-theme";

interface props {
  children: React.ReactNode;
}

const ThemeContextProvider = (props: props) => {
  const [isLightTheme, setIsLightTheme] = useState(true);

  const themeSwitcher = () => {
    const htmlTag = document.getElementsByTagName("html")[0];

    const theme = htmlTag.getAttribute(themeAttribute);
    if (theme === "light") {
      htmlTag.setAttribute(themeAttribute, "dark");
      window.localStorage.setItem(localStorageVariable, "dark");
      setIsLightTheme(false);
    } else {
      htmlTag.setAttribute(themeAttribute, "light");
      window.localStorage.setItem(localStorageVariable, "light");
      setIsLightTheme(true);
    }
  };

  useEffect(() => {
    const lsTheme = window.localStorage.getItem(localStorageVariable);

    if (lsTheme === null) {
      const htmlTag = document.getElementsByTagName("html")[0];

      //? Checking if the browser theme
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        htmlTag.setAttribute(themeAttribute, "dark");
        window.localStorage.setItem(localStorageVariable, "dark");
        setIsLightTheme(false);
      } else {
        htmlTag.setAttribute(themeAttribute, "light");
        window.localStorage.setItem(localStorageVariable, "light");
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ isLightTheme, themeSwitcher }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
