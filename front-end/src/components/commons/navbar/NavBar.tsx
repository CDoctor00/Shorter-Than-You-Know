import Logo from "../logo/Logo";
import { FaMoon, FaSun, FaUser } from "react-icons/fa6";
import { useContext } from "react";
import { ThemeContext } from "../../../contexts/theme/Context";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../language-selector/LanguageSelector";
import "./NavBar.css";

function NavBar() {
  const { isLightTheme, themeSwitcher } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="navbar">
        <Logo
          onClick={() => {
            navigate("/home");
          }}
        />
        <div className="icons">
          <LanguageSelector />
          <div onClick={themeSwitcher}>
            {isLightTheme ? (
              <FaSun className="icon" />
            ) : (
              <FaMoon className="icon" />
            )}
          </div>
          <FaUser
            className="icon"
            onClick={() => {
              navigate("/user");
            }}
          />
        </div>
      </div>
    </>
  );
}

export default NavBar;
