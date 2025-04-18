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
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "./Card.css";

function ProfileCard() {
  const { user, logoutUser, updateUserInfo } = useContext(UserContext);
  const { setChildren, toggleModal } = useContext(ModalContext);
  const { setHistory } = useContext(HistoryContext);
  const [isShow, setIsShow] = useState(true);
  const { t } = useTranslation();

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
      .then((responseStatus) => {
        if (responseStatus === 200) {
          updateUserInfo(data.name, data.surname);
          setIsShow(true);
        } else if (responseStatus >= 400 && responseStatus < 500) {
          toast.error(t("commons.passwordFail"));
        } else if (responseStatus >= 500) {
          toast.error(t("serverError"));
        }
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
        title="Delete your profile"
        hasPassword={true}
      />
    );
  };

  const submitDelete = async (data: FormPasswordType) => {
    const token = getToken();
    if (!token) {
      return;
    }

    deleteUser(token, { password: data.password! })
      .then((responseStatus) => {
        if (responseStatus === 200) {
          logoutUser();
          toggleModal();
          setChildren(<></>);
        } else if (responseStatus >= 400 && responseStatus < 500) {
          toast.error(t("commons.passwordFail"));
        } else if (responseStatus >= 500) {
          toast.error(t("serverError"));
        }
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
        {isShow
          ? t("userPage.profile.title.see")
          : t("userPage.profile.title.update")}
      </h2>
      {isShow ? (
        <div className="info-container">
          <div className="info-rows">
            <div className="row">
              <p className="label">{`${t("userPage.profile.form.email")}`}</p>
              <p className="value horizontal">{user.email}</p>
            </div>
            <div className="row">
              <p className="label">{`${t("userPage.profile.form.name")}`}</p>
              <p className="value horizontal">{user.name}</p>
            </div>
            <div className="row">
              <p className="label">{`${t("userPage.profile.form.surname")}`}</p>
              <p className="value">{user.surname}</p>
            </div>
          </div>
          <div className="buttons">
            <button onClick={swapToUpdate}>
              <span>{t("commons.buttons.edit")}</span>
              <FaPen className="button-icon" />
            </button>
            <button onClick={swapModalToDelete}>
              <span>{t("commons.buttons.delete")}</span>
              <MdDelete className="button-icon" />
            </button>
            <button onClick={logout}>
              <span>{t("commons.buttons.logout")}</span>
              <MdLogout className="button-icon" />
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
            placeholder={t("userPage.profile.form.password")}
            required={true}
          />
          {errors.password && (
            <p className="error-input-message">{t(errors.password.message!)}</p>
          )}
          <input
            type="password"
            id="newPassword"
            {...register("newPassword")}
            className={errors.newPassword && "error-input"}
            onChange={() => {
              clearErrors("newPassword");
            }}
            placeholder={t("userPage.profile.form.newPassword")}
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
            placeholder={t("userPage.profile.form.name")}
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
            placeholder={t("userPage.profile.form.surname")}
            defaultValue={user.surname}
          />
          {errors.surname && (
            <p className="error-input-message">{errors.surname.message}</p>
          )}
          <input
            type="submit"
            id="submit"
            value={t("userPage.profile.updateButton")}
          />
        </form>
      )}
    </div>
  );
}

export default ProfileCard;
