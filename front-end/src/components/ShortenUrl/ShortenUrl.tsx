import { useContext, useState } from "react";
import { FaCopy, FaQrcode, FaRedo, FaShare } from "react-icons/fa";
import "./ShortenUrl.css";
import UrlContext from "../../contexts/UrlContext/UrlContext.tsx";
import QRCode from "../QRCode/QRCode.tsx";

function ShortenUrl() {
  const { shortenURL, setShortenURL } = useContext(UrlContext);
  const [showQR, setShowQR] = useState(false);

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

  return (
    <div className="url-container">
      <h3>Get your shorten link:</h3>
      <a href={shortenURL}>{shortenURL}</a>
      <div className="buttons">
        <button onClick={copyToClipboard}>
          {/* <span> Copy </span> */}
          <FaCopy />
        </button>
        <button>
          {/* <span> Share </span> */}
          <FaShare />
        </button>
        <button
          onClick={() => {
            setShowQR(true);
          }}
        >
          {/* <span> QR </span> */}
          <FaQrcode />
        </button>
        <button
          onClick={() => {
            setShortenURL("");
          }}
        >
          {/* <span> QR </span> */}
          <FaRedo />
        </button>
      </div>
      {showQR && <QRCode value={shortenURL} />}
    </div>
  );
}

export default ShortenUrl;
