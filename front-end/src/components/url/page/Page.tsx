import { useContext } from "react";
import { FaPlus } from "react-icons/fa6";
import FormUrl from "../form/Form";
import ShowUrl from "../show/Show";
import { UrlContext } from "../../../contexts/url/Context";
import "./Page.css";

function UrlPage() {
  const { shortenURL, setShortenURL } = useContext(UrlContext);

  return (
    <div className="url-page">
      {shortenURL === "" ? <FormUrl /> : <ShowUrl />}

      {shortenURL !== "" && (
        <button
          className="new-url-button"
          onClick={() => {
            setShortenURL("");
          }}
        >
          <span className="new-url-icon">
            <FaPlus />
          </span>
          <span className="new-url-text">Shorten new link</span>
        </button>
      )}
    </div>
  );
}

export default UrlPage;
