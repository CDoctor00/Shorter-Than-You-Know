import { FaCheckCircle, FaCopy, FaInfo } from "react-icons/fa";
import { useContext } from "react";
import { ModalContext } from "../../../../contexts/modal/Context";
import { url, UrlContext } from "../../../../contexts/url/Context";
import UrlContainer from "../../../url/container/Container";
import "./ListItem.css";

function ListItem({ url }: { url: url }) {
  const { toggleModal, setChildren } = useContext(ModalContext);
  const { setURL } = useContext(UrlContext);

  const handleClickInfo = () => {
    setURL(url);
    setChildren(<UrlContainer isNewURL={false} />);
    toggleModal();
  };

  return (
    <div className="item-container">
      <div className="main-area">
        <div className="row first">
          <FaCheckCircle />
          <h4 className="label">{url.longURL}</h4>
        </div>
        <div className="row second">
          <p className="date">{url.lastUpdateTime}</p>
          <div className="buttons">
            <button>
              <FaCopy />
            </button>
            <button onClick={handleClickInfo}>
              <FaInfo />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListItem;
