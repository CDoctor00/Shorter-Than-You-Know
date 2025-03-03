import { useContext } from "react";
import FormUrl from "../form/Form";
import ShowUrl from "../show/Show";
import { UrlContext } from "../../../contexts/url/Context";
import UrlButton from "../../commons/url-button/UrlButton";
import "./Page.css";

function UrlPage() {
  const { shortenURL } = useContext(UrlContext);

  return (
    <div className="url-page">
      {shortenURL === "" ? <FormUrl /> : <ShowUrl />}

      {shortenURL !== "" && <UrlButton />}
    </div>
  );
}

export default UrlPage;
