import React, { useContext } from "react";
import { FaCopy, FaQrcode, FaRedo, FaShare } from "react-icons/fa";
import "./ShortenUrl.css";
import UrlContext from "../../contexts/UrlContext/UrlContext.tsx";

function ShortenUrl() {
  const { shortenURL, setShortenURL } = useContext(UrlContext);

  return (
    <div className="container">
      <h3>Get your shorten link:</h3>
      <a href={shortenURL}>{shortenURL}</a>
      <div className="buttons">
        <button>
          {/* <span> Copy </span> */}
          <FaCopy />
        </button>
        <button>
          {/* <span> Share </span> */}
          <FaShare />
        </button>
        <button>
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
    </div>
  );
}

export default ShortenUrl;
