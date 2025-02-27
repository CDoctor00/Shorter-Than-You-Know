import { useContext } from "react";
import { FaCopy, FaExternalLinkAlt, FaShare } from "react-icons/fa";
import UrlContext from "../../../contexts/url/UrlContext";
import "./Shorten.css";

function ShortenUrl({
  isOpen,
  toggleUrl,
}: {
  isOpen: boolean;
  toggleUrl: () => void;
}) {
  const { shortenURL } = useContext(UrlContext);

  const copyToClipboard = () => {
    try {
      navigator.clipboard
        .writeText(shortenURL)
        .then(() => {
          console.log("Copied");
        })
        .catch((err) => {
          console.error("Error: ", err);
        });
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  //? remove protocol from URL
  const shorten = shortenURL.slice(
    shortenURL.indexOf("//") + 2,
    shortenURL.length
  );

  return (
    <div className={`url-container shorten ${isOpen ? "open" : "close"}`}>
      <label
        className={`url-label shorten ${isOpen ? "" : "close"}`}
        onClick={isOpen ? undefined : toggleUrl}
      >
        Get your shorten link
      </label>
      <div className="shorten-wrapper">
        <a href={shortenURL} className="shorten-url">
          <span className="redirect-icon">
            <FaExternalLinkAlt />
          </span>
          <span className="redirect-url">{shorten}</span>
        </a>
        <div className="buttons">
          <button onClick={copyToClipboard}>
            <span> Copy </span>
            <FaCopy />
          </button>
          <button>
            <span> Share </span>
            <FaShare />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShortenUrl;
