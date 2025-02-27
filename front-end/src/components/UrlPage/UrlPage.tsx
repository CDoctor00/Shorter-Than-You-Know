import { useState } from "react";
import FormUrl from "../FormUrl/FormUrl.tsx";
import UrlContext from "../../contexts/UrlContext/UrlContext.tsx";
import "./UrlPage.css";
import ShowUrl from "../ShowUrl/ShowUrl.tsx";
import { FaPlus } from "react-icons/fa6";

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
