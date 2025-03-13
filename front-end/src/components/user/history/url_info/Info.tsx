import { useContext } from "react";
import { UrlContext } from "../../../../contexts/url/Context";
import "./Info.css";

function UrlInfo() {
  const { url } = useContext(UrlContext);

  if (!url) {
    return null;
  }

  return (
    <div className="rows">
      <div className="row">
        <p className="label">Long URL:</p>
        <p className="value horizontal">{url.longUrl}</p>
      </div>
      <div className="row">
        <p className="label">Short URL:</p>
        <p className="value horizontal">{url.shortUrl}</p>
      </div>
      <div className="row">
        <p className="label">Status:</p>
        <p className="value">{url.status}</p>
      </div>
      <div className="row">
        <p className="label">Created At:</p>
        <p className="value">{url.createTime!.toLocaleString()}</p>
      </div>
      <div className="row">
        <p className="label">Updated At:</p>
        <p className="value">{url.updateTime!.toLocaleString()}</p>
      </div>
      <div className="row">
        <p className="label">Expire At:</p>
        <p className="value">{url.expirationTime?.toLocaleString()}</p>
      </div>
      <div className="row">
        <p className="label">Note:</p>
        <p className="value vertical">{url.note}</p>
      </div>
      <div className="row">
        <p className="label">Clicks:</p>
        <p className="value">{url.clicks}</p>
      </div>
    </div>
  );
}

export default UrlInfo;
