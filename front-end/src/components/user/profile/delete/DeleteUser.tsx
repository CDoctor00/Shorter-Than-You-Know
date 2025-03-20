import { z } from "zod";
import { useContext } from "react";
import { UserContext } from "../../../../contexts/user/Context";
import { ModalContext } from "../../../../contexts/modal/Context";
import { getToken } from "../../../../services/api/utils/tokens";
import { deleteUser } from "../../../../services/api/auth/deleteUser";
import "./DeleteUser.css";

const DeleteUser = () => {
  const { user, logoutUser } = useContext(UserContext);
  const { toggleModal, setChildren } = useContext(ModalContext);

  if (!user) {
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

    deleteUser(token, { password: resultsForm.data.password })
      .then(() => {
        logoutUser();
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

export default DeleteUser;
