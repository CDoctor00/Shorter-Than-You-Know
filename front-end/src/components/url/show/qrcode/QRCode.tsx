import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useContext,
} from "react";
import { UrlContext } from "../../../../contexts/url/Context";
import { QRCodeSVG } from "qrcode.react";
import { FaCopy, FaDownload } from "react-icons/fa";
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

  const createBlob = useCallback(() => {
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
    createBlob();
  }, [createBlob]);

  useEffect(() => {
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataURL)}`;
  }, [img, dataURL]);

  const copyToClipboard = () => {
    if (!blob) return;

    navigator.clipboard
      .write([new ClipboardItem({ "image/png": blob })])
      .then(() => console.log("Image copied to clipboard"))
      .catch((err) => console.error("Error copying image:", err));
  };

  const downdload = () => {
    if (!blob) return;

    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = "qrcode.png";
    element.click();
    console.log("download start");
  };

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
        {`${isNew ? "Get" : "See"} your QR code`}
      </label>
      <div className="qr-wrapper">
        <QRCodeSVG
          value={url.shortUrl}
          level={"M"}
          id="qrcode"
          marginSize={1}
        />
        <div className="buttons">
          <button onClick={copyToClipboard}>
            <span> Copy </span>
            <FaCopy />
          </button>
          <button onClick={downdload}>
            <span> Download </span>
            <FaDownload />
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCode;
