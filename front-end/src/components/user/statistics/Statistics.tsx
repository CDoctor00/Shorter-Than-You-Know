import { FaCheckCircle, FaLink, FaMousePointer } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { HistoryContext } from "../../../contexts/history/Context";
import { getStatus } from "../../../services/system/urls";
import "./Statistics.css";

function Statistics() {
  const { history } = useContext(HistoryContext);
  const [totalLinks, setTotalLinks] = useState(0);
  const [activeLinks, setActiveLinks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    let tl = 0,
      al = 0,
      c = 0;

    history.map((item) => {
      tl++;

      const exp = item.expirationTime
        ? new Date(item.expirationTime)
        : undefined;
      if (getStatus(item.isEnabled!, exp) == "Active") {
        al++;
      }

      c = item.clicks ? c + item.clicks : c;
    });

    setTotalLinks(tl);
    setActiveLinks(al);
    setTotalClicks(c);
  }, [history]);

  return (
    <div className="statistics-container">
      <h2 className="statistics-title">{t("userPage.statistics.title")}</h2>
      <div className="statistics-card">
        <div className="item">
          <FaLink className="stats-icon" />
          <p className="number">{totalLinks}</p>
          <p className="description">{t("userPage.statistics.totalLinks")}</p>
        </div>
        <div className="item">
          <FaMousePointer className="stats-icon" />
          <p className="number">{totalClicks}</p>
          <p className="description">{t("userPage.statistics.totalClicks")}</p>
        </div>
        <div className="item">
          <FaCheckCircle className="stats-icon" />
          <p className="number">{activeLinks}</p>
          <p className="description">{t("userPage.statistics.activeLinks")}</p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
