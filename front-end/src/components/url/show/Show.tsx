import { useState } from "react";
import UrlData from "../data/Data";
import QRCode from "../qrcode/QRCode";
import "./Show.css";

interface props {
  isNewURL: boolean;
  toggleForm: () => void;
}

function ShowUrl({ isNewURL, toggleForm }: props) {
  const [isOpenQR, setIsOpenQR] = useState(false);

  const toggleQR = () => {
    setIsOpenQR(!isOpenQR);
  };

  return (
    <div className={`show-url ${isNewURL ? "small" : "big"}`}>
      <UrlData
        isOpen={!isOpenQR}
        isNewURL={isNewURL}
        toggleQR={toggleQR}
        toggleForm={toggleForm}
      />
      <QRCode isOpen={isOpenQR} toggleQR={toggleQR} isNewURL={isNewURL} />
    </div>
  );
}

export default ShowUrl;
