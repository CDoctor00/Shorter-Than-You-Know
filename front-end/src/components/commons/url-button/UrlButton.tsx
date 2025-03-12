import { FaPlus } from "react-icons/fa6";
import "./UrlButton.css";
import { useContext } from "react";
import { UrlContext } from "../../../contexts/url/Context";

interface props {
  text?: string;
  redirect?: boolean;
}

function UrlButton(props: props) {
  const { setURL } = useContext(UrlContext);

  return (
    <button
      className="url-button"
      onClick={() => {
        setURL(undefined);
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
