import { useContext, useState } from "react";
import UrlData from "../data/Data";
import QRCode from "../qrcode/QRCode";
import { UrlContext } from "../../../contexts/url/Context";
import "./Show.css";

interface props {
  toggleForm: () => void;
}

function ShowUrl({ toggleForm }: props) {
  const [isOpenQR, setIsOpenQR] = useState(false);
  const { isNew } = useContext(UrlContext);

  const toggleQR = () => {
    setIsOpenQR(!isOpenQR);
  };

  return (
    <div className={`show-url ${isNew ? "small" : "big"}`}>
      <UrlData isOpen={!isOpenQR} toggleQR={toggleQR} toggleForm={toggleForm} />
      <QRCode isOpen={isOpenQR} toggleQR={toggleQR} />
    </div>
  );
}

export default ShowUrl;
