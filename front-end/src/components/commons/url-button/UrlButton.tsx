import { FaPlus } from "react-icons/fa6";
import { useContext } from "react";
import { UrlContext } from "../../../contexts/url/Context";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./UrlButton.css";

function UrlButton({ redirect }: { redirect: boolean }) {
  const { setUrl, setShowForm } = useContext(UrlContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      className="url-button"
      onClick={() => {
        setUrl(undefined, true);

        if (redirect) {
          navigate("/shorten");
        } else {
          setShowForm(true);
        }
      }}
    >
      <span className="url-icon">
        <FaPlus />
      </span>
      <span className="url-text">{t("commons.urlButton")}</span>
    </button>
  );
}

export default UrlButton;
