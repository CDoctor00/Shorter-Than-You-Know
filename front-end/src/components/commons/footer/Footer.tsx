import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import "./Footer.css";

function Footer() {
  const { t } = useTranslation();

  return (
    <div className="footer">
      <div className="bar-container">
        <h5 className="text">{t("commons.footerPhrase")}</h5>
        <div className="icons">
          <a href="https://github.com/CDoctor00" target="_blank">
            <FaGithub className="icon" />
          </a>
          <a
            href="https://www.linkedin.com/in/mattia-caprio-745649270/"
            target="_blank"
          >
            <FaLinkedin className="icon" />
          </a>
          <a href="https://www.instagram.com/_.caprio._/" target="_blank">
            <FaInstagram className="icon" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
