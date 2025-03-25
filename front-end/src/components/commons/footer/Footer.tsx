import { FaGithub, FaInstagram, FaLinkedin, FaPaypal } from "react-icons/fa6";
import "./Footer.css";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <div className="footer">
      <h5>{t("commons.footerPhrase")}</h5>
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
