import UrlButton from "../../commons/url-button/UrlButton";
import Image from "./Image";
import { useTranslation } from "react-i18next";
import "./Main.css";

function Main() {
  const { t } = useTranslation();

  return (
    <div className="main">
      <div className="main-container">
        <div className="top-container">
          <h2 className="title">{t("homePage.main.title")}</h2>
          <p className="description"> {t("homePage.main.description")}</p>
        </div>
        <Image />
      </div>
      <UrlButton redirect={true} />
    </div>
  );
}

export default Main;
