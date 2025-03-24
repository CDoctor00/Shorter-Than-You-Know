import { useContext, useState } from "react";
import { UrlContext } from "../../../../contexts/url/Context";
import UrlData from "../data/Data";
import QRCode from "../qrcode/QRCode";
import "./Container.css";

function ShowUrlContainer() {
  const [isOpenQR, setIsOpenQR] = useState(false);
  const { isNew } = useContext(UrlContext);

  const toggleQR = () => {
    setIsOpenQR(!isOpenQR);
  };

  return (
    <div className={`show-url-container ${isNew ? "small" : "big"}`}>
      <UrlData isOpen={!isOpenQR} toggleQR={toggleQR} />
      <QRCode isOpen={isOpenQR} toggleQR={toggleQR} />
    </div>
  );
}

export default ShowUrlContainer;
