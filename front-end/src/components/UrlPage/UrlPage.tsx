import { useState } from "react";
import FormUrl from "../FormUrl/FormUrl.tsx";
import ShortenUrl from "../ShortenUrl/ShortenUrl.tsx";
import UrlContext from "../../contexts/UrlContext/UrlContext.tsx";
import "./UrlPage.css";

function UrlPage() {
  const [shortenURL, setShortenURL] = useState("");

  return (
    <div className="urlPage">
      <UrlContext.Provider value={{ shortenURL, setShortenURL }}>
        {shortenURL === "" ? <FormUrl /> : <ShortenUrl />}
      </UrlContext.Provider>
    </div>
  );
}

export default UrlPage;
