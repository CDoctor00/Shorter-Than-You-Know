import React, { useState } from "react";
import FormUrl from "../FormUrl/FormUrl.tsx";
import ShortenUrl from "../ShortenUrl/ShortenUrl.tsx";
import UrlContext from "../../contexts/UrlContext/UrlContext.tsx";

function UrlPage() {
  const [shortenURL, setShortenURL] = useState("");

  return (
    <UrlContext.Provider value={{ shortenURL, setShortenURL }}>
      {shortenURL === "" ? <FormUrl /> : <ShortenUrl />}
    </UrlContext.Provider>
  );
}

export default UrlPage;
