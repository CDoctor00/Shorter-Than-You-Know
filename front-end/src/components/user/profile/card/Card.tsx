import { z } from "zod";
import { MdDelete, MdLogout } from "react-icons/md";
import { FaPen } from "react-icons/fa6";
import Delete from "../../../commons/delete/Delete";
import { useContext, useState } from "react";
import { HistoryContext } from "../../../../contexts/history/Context";
import { UserContext } from "../../../../contexts/user/Context";
import { ModalContext } from "../../../../contexts/modal/Context";
import { updateUser } from "../../../../services/api/auth/updateUser";
import { getToken } from "../../../../services/api/utils/tokens";
import { deleteUser } from "../../../../services/api/auth/deleteUser";
import "./Card.css";

function ProfileCard() {
  const { user, logoutUser, updateUserInfo } = useContext(UserContext);
  const { setChildren, toggleModal } = useContext(ModalContext);
  const { setHistory } = useContext(HistoryContext);
  const [isShow, setIsShow] = useState(true);

  if (!user) {
    return;
  }

  const swapToUpdate = () => {
    setIsShow(false);
  };

  const update = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    const formSchema = z.object({
      password: z.string({ message: "password error" }),
      newPassword: z
        .string({ message: "new password error" })
        .optional()
        .transform((val) => val || undefined),
      name: z
        .string({ message: "name error" })
        .optional()
        .transform((val) => val || undefined),
      surname: z
        .string({ message: "surname error" })
        .optional()
        .transform((val) => val || undefined),
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

    updateUser(token, {
      password: resultsForm.data.password,
      name: resultsForm.data.name,
      surname: resultsForm.data.surname,
      newPassword: resultsForm.data.newPassword,
    })
      .then(() => {
        updateUserInfo(resultsForm.data.name, resultsForm.data.surname);
        setIsShow(true);
      })
      .catch((error) => {
        console.error(error);
        return;
      });
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

  const swapModalToDelete = () => {
    setChildren(
      <Delete submitDelete={submitDelete} title="Delete your profile" />
    );
  };

  const logout = () => {
    logoutUser();
    setHistory([]);
    toggleModal();
  };

  return (
    <div className="profile-card-container">
      <h2 className="title">
        {isShow ? "See your profile" : "Update your profile"}
      </h2>
      {isShow ? (
        <div className="info-container">
          <div className="info-rows">
            <div className="row">
              <p className="label">Email:</p>
              <p className="value horizontal">{user.email}</p>
            </div>
            <div className="row">
              <p className="label">Name:</p>
              <p className="value horizontal">{user.name}</p>
            </div>
            <div className="row">
              <p className="label">Surname:</p>
              <p className="value">{user.surname}</p>
            </div>
          </div>
          <div className="buttons">
            <button onClick={swapToUpdate}>
              <FaPen />
            </button>
            <button onClick={swapModalToDelete}>
              <MdDelete />
            </button>
            <button onClick={logout}>
              <MdLogout />
            </button>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={update}>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required={true}
            />
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Type new password to update it"
            />
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              defaultValue={user.name}
            />
            <input
              type="text"
              id="surname"
              name="surname"
              placeholder="Suranme"
              defaultValue={user.surname}
            />

            <input type="submit" id="submit" value={"Update"} />
          </form>
        </>
      )}
    </div>
  );
}

export default ProfileCard;
