import { useState } from "react";
import ShortenUrl from "../shorten/Shorten";
import QRCode from "../qrcode/QRCode";
import "./Show.css";

function ShowUrl() {
  const [isOpenQR, setIsOpenQR] = useState(false);

  const toggleUrl = () => {
    setIsOpenQR(!isOpenQR);
  };

  return (
    <div className="show-url">
      <ShortenUrl isOpen={!isOpenQR} toggleUrl={toggleUrl} />
      <QRCode isOpen={isOpenQR} toggleUrl={toggleUrl} />
    </div>
  );
}

export default ShowUrl;
