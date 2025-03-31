import { useContext, useEffect } from "react";
import { UrlContext } from "../../../contexts/url/Context";
import UrlButton from "../../commons/url-button/UrlButton";
import UrlContainer from "../container/Container";
import "./Page.css";

function UrlPage() {
  const { url, setUrl, setShowForm } = useContext(UrlContext);

  useEffect(() => {
    setUrl(undefined, true);
    setShowForm(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="url-page">
      <div className="url-wrapper">
        <UrlContainer />

        {url && <UrlButton redirect={false} />}
      </div>
    </div>
  );
}

export default UrlPage;
