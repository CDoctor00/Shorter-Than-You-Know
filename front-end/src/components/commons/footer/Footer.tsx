import { FaGithub, FaInstagram, FaLinkedin, FaPaypal } from "react-icons/fa6";
import "./Footer.css";

function Footer() {
  return (
    <div className="footer">
      <h5>Made with blood and sweat</h5>
      <div className="icons">
        <FaGithub className="icon" />
        <FaLinkedin className="icon" />
        <FaInstagram className="icon" />
        <FaPaypal className="icon" />
      </div>
    </div>
  );
}

export default Footer;
