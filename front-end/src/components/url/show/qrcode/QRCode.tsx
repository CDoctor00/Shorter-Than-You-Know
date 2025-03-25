import { useState, useEffect, useRef, useMemo, useContext } from "react";
import { UrlContext } from "../../../../contexts/url/Context";
import { QRCodeSVG } from "qrcode.react";
import { FaCopy, FaDownload } from "react-icons/fa";
import { downdloadBlob } from "../../../../services/system/download_blob";
import { copyToClipboard } from "../../../../services/system/clipboard";
import { useTranslation } from "react-i18next";
import "./QRCode.css";

interface props {
  isOpen: boolean;
  toggleQR: () => void;
}

function QRCode({ isOpen, toggleQR }: props) {
  const refQR = useRef<HTMLDivElement | null>(null);
  const { url, isNew } = useContext(UrlContext);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [dataURL, setDataURL] = useState<string>("");
  const img = useMemo(() => new Image(), []);
  const { t } = useTranslation();

  useEffect(() => {
    if (refQR.current) {
      const svgElement = refQR.current!.querySelector("svg");
      if (svgElement) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        setDataURL(new XMLSerializer().serializeToString(svgElement));

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            setBlob(blob);
          }, "image/png");
        };
      }
    }
  }, [img]);

  useEffect(() => {
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataURL)}`;
  }, [img, dataURL]);

  if (!url) {
    return null;
  }

  return (
    <div
      className={`card-container down ${isNew ? "small" : "big"} ${
        isOpen ? "open" : "close"
      }`}
      id="qr-container"
      ref={refQR}
    >
      <label
        className={`card-label down ${isOpen ? "" : "close"}`}
        onClick={isOpen ? undefined : toggleQR}
      >
        {isNew ? t("urlPage.show.qrTitle.new") : t("urlPage.show.qrTitle.old")}
      </label>
      <div className="qr-wrapper">
        <QRCodeSVG
          value={url.shortUrl}
          level={"M"}
          id="qrcode"
          marginSize={1}
        />
        <div className="buttons">
          <button
            onClick={() => {
              copyToClipboard(blob);
            }}
          >
            <FaCopy />
          </button>
          <button
            onClick={() => {
              downdloadBlob(blob);
            }}
          >
            <FaDownload />
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCode;
