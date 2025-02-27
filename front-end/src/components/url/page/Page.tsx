import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import FormUrl from "../form/Form.tsx";
import ShowUrl from "../show/Show.tsx";
import UrlContext from "../../../contexts/url/UrlContext.tsx";
import "./Page.css";

function UrlPage() {
  const [shortenURL, setShortenURL] = useState("");

  return (
    <div className="url-page">
      <UrlContext.Provider value={{ shortenURL, setShortenURL }}>
        {shortenURL === "" ? <FormUrl /> : <ShowUrl />}
      </UrlContext.Provider>

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
