import { useContext, useState } from "react";
import { UrlContext } from "../../../../contexts/url/Context";
import UrlData from "../data/Data";
import QRCode from "../qrcode/QRCode";
import "./Container.css";

interface props {
  toggleForm: () => void;
}

function ShowUrlContainer({ toggleForm }: props) {
  const [isOpenQR, setIsOpenQR] = useState(false);
  const { isNew } = useContext(UrlContext);

  const toggleQR = () => {
    setIsOpenQR(!isOpenQR);
  };

  return (
    <div className={`show-url-container ${isNew ? "small" : "big"}`}>
      <UrlData isOpen={!isOpenQR} toggleQR={toggleQR} toggleForm={toggleForm} />
      <QRCode isOpen={isOpenQR} toggleQR={toggleQR} />
    </div>
  );
}

export default ShowUrlContainer;
