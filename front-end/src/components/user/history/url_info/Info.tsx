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
        <p className="value horizontal">{url.longURL}</p>
      </div>
      <div className="row">
        <p className="label">Shorten URL:</p>
        <p className="value horizontal">{url.shortenURL}</p>
      </div>
      <div className="row">
        <p className="label">Status:</p>
        <p className="value">{url.status}</p>
      </div>
      <div className="row">
        <p className="label">Create Time:</p>
        <p className="value">{url.createdTime}</p>
      </div>
      <div className="row">
        <p className="label">Last Update Time:</p>
        <p className="value">{url.lastUpdateTime}</p>
      </div>
      <div className="row">
        <p className="label">Expiration Time:</p>
        <p className="value">{url.expirationTime}</p>
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
