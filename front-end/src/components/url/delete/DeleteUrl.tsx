import { useContext } from "react";
import { UrlContext } from "../../../contexts/url/Context";
import { ModalContext } from "../../../contexts/modal/Context";
import { HistoryContext } from "../../../contexts/history/Context";
import { z } from "zod";
import { deleteUrl } from "../../../services/api/auth/deleteUrl";
import { getToken } from "../../../services/api/utils/tokens";
import "./DeleteUrl.css";

const DeleteUrl = () => {
  const { url } = useContext(UrlContext);
  const { removeItem } = useContext(HistoryContext);
  const { toggleModal, setChildren } = useContext(ModalContext);

  if (!url) {
    return null;
  }

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

  return (
    <div className="delete-container">
      <form onSubmit={submitDelete}>
        <input type="password" name="password" placeholder="Password" />
        <input type="submit" value="Confirm delete" />
      </form>
    </div>
  );
};

export default DeleteUrl;
