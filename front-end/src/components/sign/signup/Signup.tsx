import { FaFacebook, FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa6";
import { useRef } from "react";
import { signup } from "../../../services/api/base/signup";
import {
  formSignupSchema,
  FormSignupType,
} from "../../../services/zod/form/signup";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import "./Signup.css";

function SignUp({
  isOpen,
  toggleForm,
}: {
  isOpen: boolean;
  toggleForm: () => void;
}) {
  const ref = useRef<HTMLFormElement | null>(null);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormSignupType>({
    resolver: zodResolver(formSignupSchema),
  });

  const onSubmit = async (data: FormSignupType) => {
    signup({
      email: data.email,
      password: data.password1,
      name: data.name,
      surname: data.surname,
    })
      .then(() => {
        toggleForm();
        ref.current?.reset();
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  };

  return (
    <div className="card-container">
      <label
        onClick={isOpen ? undefined : toggleForm}
        className={`card-label up ${isOpen ? "" : "close"}`}
      >
        {t("signPage.signup.title")}
      </label>
      <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
        <div className="inputs-container">
          <input
            type="text"
            placeholder={t("signPage.signup.form.name")}
            {...register("name")}
            onChange={() => {
              clearErrors("name");
            }}
            className={errors.name && "error-input"}
          />
          {errors.name && (
            <p className="error-input-message">{errors.name.message}</p>
          )}
          <input
            type="text"
            placeholder={t("signPage.signup.form.surname")}
            {...register("surname")}
            onChange={() => {
              clearErrors("surname");
            }}
            className={errors.surname && "error-input"}
          />
          {errors.surname && (
            <p className="error-input-message">{errors.surname.message}</p>
          )}
          <input
            type="text"
            placeholder={t("signPage.signup.form.email")}
            {...register("email")}
            onChange={() => {
              clearErrors("email");
            }}
            className={errors.email && "error-input"}
          />
          {errors.email && (
            <p className="error-input-message">{t(errors.email.message!)}</p>
          )}
          <input
            type="password"
            placeholder={t("signPage.signup.form.password1")}
            {...register("password1")}
            onChange={() => {
              clearErrors("password1");
            }}
            className={errors.password1 && "error-input"}
          />
          {errors.password1 && (
            <p className="error-input-message">
              {t(errors.password1.message!)}
            </p>
          )}
          <input
            type="password"
            placeholder={t("signPage.signup.form.password2")}
            {...register("password2")}
            onChange={() => {
              clearErrors("password2");
            }}
            className={errors.password2 && "error-input"}
          />
          {errors.password2 && (
            <p className="error-input-message">
              {t(errors.password2.message!)}
            </p>
          )}
        </div>
        <input type="submit" value="Sign Up" />
      </form>
      <div className="icons">
        <FaFacebook className="icon" />
        <FaGoogle className="icon" />
        <FaLinkedin className="icon" />
        <FaGithub className="icon" />
      </div>
    </div>
  );
}

export default SignUp;
