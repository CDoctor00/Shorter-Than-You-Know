import { useContext } from "react";
import { UrlContext } from "../../../../contexts/url/Context";
import { useTranslation } from "react-i18next";
import "./Info.css";

function UrlInfo() {
  const { url } = useContext(UrlContext);
  const { t } = useTranslation();

  if (!url) {
    return null;
  }

  return (
    <div className="info-rows">
      <div className="row">
        <p className="label">{`${t("userPage.history.item.longUrl")}:`}</p>
        <p className="value horizontal">{url.longUrl}</p>
      </div>
      <div className="row">
        <p className="label">{`${t("userPage.history.item.shortUrl")}:`}</p>
        <p className="value horizontal">{url.shortUrl}</p>
      </div>
      <div className="row">
        <p className="label">{`${t("userPage.history.item.status")}:`}</p>
        <p className={`value status ${url.status}`}>{url.status}</p>
      </div>
      <div className="row">
        <p className="label">{`${t("userPage.history.item.createdAt")}:`}</p>
        <p className="value">{url.createTime!.toLocaleString()}</p>
      </div>
      <div className="row">
        <p className="label">{`${t("userPage.history.item.updatedAt")}:`}</p>
        <p className="value">{url.updateTime!.toLocaleString()}</p>
      </div>
      <div className="row">
        <p className="label">{`${t("userPage.history.item.expireAt")}:`}</p>
        <p className="value">{url.expirationTime?.toLocaleString()}</p>
      </div>
      <div className="row">
        <p className="label">{`${t("userPage.history.item.note")}:`}</p>
        <p className="value vertical">{url.note}</p>
      </div>
      <div className="row">
        <p className="label">{`${t("userPage.history.item.clicks")}:`}</p>
        <p className="value">{url.clicks}</p>
      </div>
    </div>
  );
}

export default UrlInfo;
