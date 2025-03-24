import { FaPlus } from "react-icons/fa6";
import { useContext } from "react";
import { UrlContext } from "../../../contexts/url/Context";
import "./UrlButton.css";

interface props {
  text?: string;
  redirect?: boolean;
}

function UrlButton(props: props) {
  const { setUrl, toggleShowForm } = useContext(UrlContext);

  return (
    <button
      className="url-button"
      onClick={() => {
        setUrl(undefined, true);
        toggleShowForm();
      }}
    >
      <span className="url-icon">
        <FaPlus />
      </span>
      <span className="url-text">
        {props.text ? props.text : `Shorten a new link`}
      </span>
    </button>
  );
}

export default UrlButton;
