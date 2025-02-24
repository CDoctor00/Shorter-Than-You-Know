import "./NavBar.css";
import Logo from "../Logo/Logo";
import Menu from "../Menu/Menu";
import { MdMenu, MdClose } from "react-icons/md";
import { useState } from "react";

function NavBar() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };
  return (
    <>
      <div className="navbar">
        <Logo />
        <button className="menu-button" onClick={toggleMenu}>
          {isMenuVisible ? <MdClose /> : <MdMenu />}
        </button>
      </div>
      <Menu isVisible={isMenuVisible}></Menu>
    </>
  );
}

export default NavBar;
