import { useState } from "react";
import "./ShowUrl.css";
import ShortenUrl from "../ShortenUrl/ShortenUrl";
import QRCode from "../QRCode/QRCode";
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
