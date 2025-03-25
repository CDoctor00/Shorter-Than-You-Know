import { TbKey, TbKeyOff } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { rows } from "./utils";
import "./Explore.css";

function Explore() {
  const { t } = useTranslation();

  return (
    <div className="explore-container">
      <div className="text-container">
        <h2 className="title">{t("homePage.explore.text.title")}</h2>
        <p className="description">{t("homePage.explore.text.description")}</p>
      </div>
      <table className="features-table">
        <tbody>
          <tr>
            <th className="header">
              {t("homePage.explore.columnsTitle.feature")}
            </th>
            <th className="header">
              <TbKey />
              {t("homePage.explore.columnsTitle.signed")}
            </th>
            <th className="header">
              <TbKeyOff />
              {t("homePage.explore.columnsTitle.free")}
            </th>
          </tr>
          {rows.map((row) => {
            return (
              <tr key={row.id}>
                <td>{t(row.feature)}</td>
                <td>{row.signed}</td>
                <td>{row.free}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Explore;
