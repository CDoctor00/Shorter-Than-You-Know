import { useContext, useEffect } from "react";
import { UrlContext } from "../../../contexts/url/Context";
import UrlButton from "../../commons/url-button/UrlButton";
import UrlContainer from "../container/Container";
import "./Page.css";

function UrlPage() {
  const { url, setUrl } = useContext(UrlContext);

  useEffect(() => {
    setUrl(undefined, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="url-page">
      <UrlContainer />

      {url && <UrlButton />}
    </div>
  );
}

export default UrlPage;
