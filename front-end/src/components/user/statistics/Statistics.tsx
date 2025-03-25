import { FaCheckCircle, FaLink, FaMousePointer } from "react-icons/fa";
import "./Statistics.css";
import { useTranslation } from "react-i18next";

interface props {
  clicks: number;
  totalLinks: number;
  activeLinks: number;
}

function Statistics(props: props) {
  const { t } = useTranslation();

  return (
    <div className="statistics-container">
      <h2 className="statistics-title">{t("userPage.statistics.title")}</h2>
      <div className="statistics-card">
        <div className="item">
          <FaLink className="stats-icon" />
          <p className="number">{props.totalLinks}</p>
          <p className="description">{t("userPage.statistics.totalLinks")}</p>
        </div>
        <div className="item">
          <FaMousePointer className="stats-icon" />
          <p className="number">{props.clicks}</p>
          <p className="description">{t("userPage.statistics.totalClicks")}</p>
        </div>
        <div className="item">
          <FaCheckCircle className="stats-icon" />
          <p className="number">{props.activeLinks}</p>
          <p className="description">{t("userPage.statistics.activeLinks")}</p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
