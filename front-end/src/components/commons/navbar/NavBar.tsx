import Logo from "../logo/Logo";
import { FaMoon, FaSun, FaUser } from "react-icons/fa6";
import { useContext } from "react";
import { ThemeContext } from "../../../contexts/theme/Context";
import "./NavBar.css";

function NavBar() {
  const { isLightTheme, themeSwitcher } = useContext(ThemeContext);

  return (
    <>
      <div className="navbar">
        <Logo />
        <div className="icons">
          <div onClick={themeSwitcher}>
            {isLightTheme ? (
              <FaSun className="icon" />
            ) : (
              <FaMoon className="icon" />
            )}
          </div>
          <FaUser className="icon" />
        </div>
      </div>
    </>
  );
}

export default NavBar;
