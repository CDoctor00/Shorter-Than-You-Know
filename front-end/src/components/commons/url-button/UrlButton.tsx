import { FaPlus } from "react-icons/fa6";
import { useContext } from "react";
import { UrlContext } from "../../../contexts/url/Context";
import { useNavigate } from "react-router-dom";
import "./UrlButton.css";

interface props {
  redirect: boolean;
  text?: string;
}

function UrlButton({ redirect, text }: props) {
  const { setUrl, toggleShowForm } = useContext(UrlContext);
  const navigate = useNavigate();

  return (
    <button
      className="url-button"
      onClick={() => {
        setUrl(undefined, true);

        if (redirect) {
          navigate("/shorten");
        } else {
          toggleShowForm();
        }
      }}
    >
      <span className="url-icon">
        <FaPlus />
      </span>
      <span className="url-text">{text ? text : `Shorten a new link`}</span>
    </button>
  );
}

export default UrlButton;
