import { FaCopy, FaExternalLinkAlt, FaShare, FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useContext } from "react";
import { UrlContext } from "../../../../contexts/url/Context";
import { ModalContext } from "../../../../contexts/modal/Context";
import { HistoryContext } from "../../../../contexts/history/Context";
import { getToken } from "../../../../services/api/utils/tokens";
import { deleteUrl } from "../../../../services/api/auth/delete_url";
import Delete from "../../../commons/delete/Delete";
import UrlInfo from "../../../user/history/url_info/Info";
import { FormPasswordType } from "../../../../services/zod/form/password";
import { copyToClipboard } from "../../../../services/system/clipboard";
import { useTranslation } from "react-i18next";
import "./Data.css";

interface props {
  isOpen: boolean;
  toggleQR: () => void;
}

function UrlData({ isOpen, toggleQR }: props) {
  const { url, isNew, toggleShowForm } = useContext(UrlContext);
  const { toggleModal, setChildren } = useContext(ModalContext);
  const { removeItem } = useContext(HistoryContext);
  const { t } = useTranslation();

  if (!url) {
    return null;
  }

  const modifyURL = () => {
    toggleShowForm();
  };

  const submitDelete = async (data: FormPasswordType) => {
    const token = getToken();
    if (!token) {
      return;
    }

    deleteUrl(token, { password: data.password, uuid: url.uuid! })
      .then(() => {
        removeItem(url.uuid!);
        toggleModal();
        setChildren(<></>);
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  };

  const swapModalToDelete = () => {
    setChildren(
      <Delete
        submitDelete={submitDelete}
        title={t("commons.delete.urlTitle")}
      />
    );
  };

  //? remove protocol from URL
  const shorten = url.shortUrl.slice(url.shortUrl.indexOf("//") + 2);

  return (
    <div className={`card-container ${isOpen ? "open" : "close"}`}>
      <label
        className={`card-label up ${isOpen ? "" : "close"}`}
        onClick={isOpen ? undefined : toggleQR}
      >
        {isNew
          ? t("urlPage.show.urlTitle.new")
          : t("urlPage.show.urlTitle.old")}
      </label>
      <div className="shorten-wrapper">
        {isNew ? (
          <a href={url.shortUrl} className="shorten-url">
            <span className="redirect-icon">
              <FaExternalLinkAlt />
            </span>
            <span className="redirect-url">{shorten}</span>
          </a>
        ) : (
          <UrlInfo />
        )}
        <div className="buttons">
          <button
            onClick={() => {
              copyToClipboard(url.shortUrl);
            }}
          >
            <FaCopy />
          </button>
          <button>
            <FaShare />
          </button>
          {!isNew && (
            <>
              <button onClick={modifyURL}>
                <FaPen />
              </button>
              <button onClick={swapModalToDelete}>
                <MdDelete />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UrlData;
