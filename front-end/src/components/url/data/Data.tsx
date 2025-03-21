import { z } from "zod";
import { FaCopy, FaExternalLinkAlt, FaShare, FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useContext } from "react";
import { UrlContext } from "../../../contexts/url/Context";
import { ModalContext } from "../../../contexts/modal/Context";
import UrlInfo from "../../user/history/url_info/Info";
import Delete from "../../commons/delete/Delete";
import { getToken } from "../../../services/api/utils/tokens";
import { HistoryContext } from "../../../contexts/history/Context";
import { deleteUrl } from "../../../services/api/auth/deleteUrl";
import "./Data.css";

interface props {
  isOpen: boolean;
  toggleQR: () => void;
  toggleForm: () => void;
}

function UrlData({ isOpen, toggleQR, toggleForm }: props) {
  const { url, isNew } = useContext(UrlContext);
  const { toggleModal, setChildren } = useContext(ModalContext);
  const { removeItem } = useContext(HistoryContext);

  if (!url) {
    return null;
  }

  const modifyURL = () => {
    toggleForm();
  };

  const submitDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    const formSchema = z.object({
      password: z.string({ message: "password error" }).nonempty(),
    });

    const resultsForm = formSchema.safeParse(formValues);
    if (!resultsForm.success) {
      console.error(resultsForm.error);
      return;
    }

    const token = getToken();
    if (!token) {
      return;
    }

    deleteUrl(token, { password: resultsForm.data.password, uuid: url.uuid! })
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
      <Delete deleteFunction={submitDelete} title="Delete your url" />
    );
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard
        .writeText(url.shortUrl)
        .then(() => {
          console.log("Copied");
        })
        .catch((err) => {
          console.error("Error: ", err);
        });
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  //? remove protocol from URL
  const shorten = url.shortUrl.slice(
    url.shortUrl.indexOf("//") + 2,
    url.shortUrl.length
  );

  return (
    <div className={`card-container ${isOpen ? "open" : "close"}`}>
      <label
        className={`card-label up ${isOpen ? "" : "close"}`}
        onClick={isOpen ? undefined : toggleQR}
      >
        {`${isNew ? "Get" : "See"} your shorten link`}
      </label>
      <div className="shorten-wrapper">
        {isNew ? (
          <>
            <a href={url.shortUrl} className="shorten-url">
              <span className="redirect-icon">
                <FaExternalLinkAlt />
              </span>
              <span className="redirect-url">{shorten}</span>
            </a>
          </>
        ) : (
          <UrlInfo />
        )}
        <div className="buttons">
          <button onClick={copyToClipboard}>
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
