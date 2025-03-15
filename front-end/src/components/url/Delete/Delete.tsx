import { useContext } from "react";
import { UrlContext } from "../../../contexts/url/Context";
import { mockToken } from "../../user/history/container/utils";
import { ModalContext } from "../../../contexts/modal/Context";
import { HistoryContext } from "../../../contexts/history/Context";
import { z } from "zod";
import "./Delete.css";

const Delete = () => {
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

    const response = await fetch("http://localhost:10000/api/auth/deleteUrl", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockToken}`,
      },
      body: JSON.stringify({
        uuid: url.uuid,
        password: resultsForm.data.password,
      }),
    });

    if (!response.ok) {
      console.error(response);
      return;
    }

    removeItem(url.uuid!);

    toggleModal();
    setChildren(<></>);
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

export default Delete;
