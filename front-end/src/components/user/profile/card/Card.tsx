import { MdDelete, MdLogout } from "react-icons/md";
import { FaPen } from "react-icons/fa6";
import Delete from "../../../commons/delete/Delete";
import { useContext, useState } from "react";
import { HistoryContext } from "../../../../contexts/history/Context";
import { UserContext } from "../../../../contexts/user/Context";
import { ModalContext } from "../../../../contexts/modal/Context";
import { updateUser } from "../../../../services/api/auth/update_user";
import { getToken } from "../../../../services/api/utils/tokens";
import { deleteUser } from "../../../../services/api/auth/delete_user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormPasswordType } from "../../../../services/zod/form/password";
import {
  formUpdateUserSchema,
  FormUpdateUserType,
} from "../../../../services/zod/form/update_user";
import "./Card.css";

function ProfileCard() {
  const { user, logoutUser, updateUserInfo } = useContext(UserContext);
  const { setChildren, toggleModal } = useContext(ModalContext);
  const { setHistory } = useContext(HistoryContext);
  const [isShow, setIsShow] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormUpdateUserType>({
    resolver: zodResolver(formUpdateUserSchema),
  });

  const swapToUpdate = () => {
    setIsShow(false);
  };

  const update = (data: FormUpdateUserType) => {
    const token = getToken();
    if (!token) {
      return;
    }

    updateUser(token, {
      password: data.password,
      name: data.name,
      surname: data.surname,
      newPassword: data.newPassword,
    })
      .then(() => {
        updateUserInfo(data.name, data.surname);
        setIsShow(true);
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

  const submitDelete = async (data: FormPasswordType) => {
    const token = getToken();
    if (!token) {
      return;
    }

    deleteUser(token, { password: data.password })
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
        <form onSubmit={handleSubmit(update)}>
          <input
            type="password"
            id="password"
            {...register("password")}
            className={errors.password && "error-input"}
            onChange={() => {
              clearErrors("password");
            }}
            placeholder="Password"
            required={true}
          />
          {errors.password && (
            <p className="error-input-message">{errors.password.message}</p>
          )}
          <input
            type="password"
            id="newPassword"
            {...register("newPassword")}
            className={errors.newPassword && "error-input"}
            onChange={() => {
              clearErrors("newPassword");
            }}
            placeholder="Type new password to update it"
          />
          {errors.newPassword && (
            <p className="error-input-message">{errors.newPassword.message}</p>
          )}
          <input
            type="text"
            id="name"
            {...register("name")}
            className={errors.name && "error-input"}
            onChange={() => {
              clearErrors("name");
            }}
            placeholder="Name"
            defaultValue={user.name}
          />
          {errors.name && (
            <p className="error-input-message">{errors.name.message}</p>
          )}
          <input
            type="text"
            id="surname"
            {...register("surname")}
            className={errors.surname && "error-input"}
            onChange={() => {
              clearErrors("surname");
            }}
            placeholder="Suranme"
            defaultValue={user.surname}
          />
          {errors.surname && (
            <p className="error-input-message">{errors.surname.message}</p>
          )}
          <input type="submit" id="submit" value={"Update"} />
        </form>
      )}
    </div>
  );
}

export default ProfileCard;
