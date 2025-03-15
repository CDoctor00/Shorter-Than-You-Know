import { useContext } from "react";
import { FaCopy, FaExternalLinkAlt, FaShare, FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { UrlContext } from "../../../contexts/url/Context";
import { ModalContext } from "../../../contexts/modal/Context";
import UrlInfo from "../../user/history/url_info/Info";
import "./Data.css";
import Delete from "../Delete/Delete";

interface props {
  isOpen: boolean;
  toggleQR: () => void;
  isNewURL: boolean;
  toggleForm: () => void;
}

function UrlData({ isOpen, toggleQR, isNewURL, toggleForm }: props) {
  const { url } = useContext(UrlContext);
  const { setChildren } = useContext(ModalContext);

  if (!url) {
    return null;
  }

  const modifyURL = () => {
    toggleForm();
  };

  const swapModalToDelete = () => {
    setChildren(<Delete />);
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard
        .writeText(url.shortUrl)
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
  const shorten = url.shortUrl.slice(
    url.shortUrl.indexOf("//") + 2,
    url.shortUrl.length
  );

  return (
    <div className={`card-container ${isOpen ? "open" : "close"}`}>
      <label
        className={`card-label up ${isOpen ? "" : "close"}`}
        onClick={isOpen ? undefined : toggleQR}
      >
        {`${isNewURL ? "Get" : "See"} your shorten link`}
      </label>
      <div className="shorten-wrapper">
        {isNewURL ? (
          <>
            <a href={url.shortUrl} className="shorten-url">
              <span className="redirect-icon">
                <FaExternalLinkAlt />
              </span>
              <span className="redirect-url">{shorten}</span>
            </a>
          </>
        ) : (
          <UrlInfo />
        )}
        <div className="buttons">
          <button onClick={copyToClipboard}>
            <FaCopy />
          </button>
          <button>
            <FaShare />
          </button>
          {!isNewURL && (
            <>
              <button onClick={modifyURL}>
                <FaPen />
              </button>
              <button onClick={swapModalToDelete}>
                <MdDelete />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UrlData;
