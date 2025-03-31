import Logo from "../logo/Logo";
import { FaMoon, FaSun, FaUser, FaUserSecret } from "react-icons/fa6";
import { useContext } from "react";
import { ThemeContext } from "../../../contexts/theme/Context";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../language-selector/LanguageSelector";
import { UserContext } from "../../../contexts/user/Context";
import "./NavBar.css";

function NavBar() {
  const { isLightTheme, themeSwitcher } = useContext(ThemeContext);
  const { isAuthenticated } = useContext(UserContext);

  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="bar-container">
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
          {isAuthenticated ? (
            <FaUser
              className="icon"
              onClick={() => {
                navigate("/user");
              }}
            />
          ) : (
            <FaUserSecret
              className="icon"
              onClick={() => {
                navigate("/user");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
