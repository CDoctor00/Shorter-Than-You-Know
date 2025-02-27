import "./NavBar.css";
import Logo from "../logo/Logo";
import { FaSun, FaUser } from "react-icons/fa6";

function NavBar() {
  return (
    <>
      <div className="navbar">
        <Logo />
        <div className="icons">
          <FaSun className="icon" />
          <FaUser className="icon" />
        </div>
      </div>
    </>
  );
}

export default NavBar;
