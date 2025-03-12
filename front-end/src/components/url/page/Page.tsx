import { useContext, useEffect } from "react";
import { UrlContext } from "../../../contexts/url/Context";
import UrlButton from "../../commons/url-button/UrlButton";
import UrlContainer from "../container/Container";
import "./Page.css";

function UrlPage() {
  const { url, setURL } = useContext(UrlContext);

  useEffect(() => {
    setURL(undefined);
  }, [setURL]);

  return (
    <div className="url-page">
      <UrlContainer isNewURL={true} />

      {url && <UrlButton />}
    </div>
  );
}

export default UrlPage;
