import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  formPasswordSchema,
  FormPasswordType,
} from "../../services/zod/form/password";
import Image from "./Image";
import { redirect } from "../../services/api/base/redirect";
import { useNavigate } from "react-router-dom";
import Loader from "../commons/loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import "./Page.css";

function RedirectPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isProtected, setIsProtected] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const openUrl = (value?: FormPasswordType) => {
    const shortID = window.location.pathname.slice(1);
    redirect({
      shortID,
      password: value?.password,
    })
      .then((response) => {
        setIsLoading(false);
        if (response.status == 200) {
          window.location.replace(response.longUrl);
        } else if (response.status == 401) {
          if (isProtected) {
            toast.error("Wrong password");
          } else {
            setIsProtected(true);
          }
        } else {
          navigate("/error");
        }
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  };

  useEffect(() => {
    openUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormPasswordType>({
    resolver: zodResolver(formPasswordSchema),
  });

  return (
    <div className="redirect-page">
      {isLoading ? (
        <Loader />
      ) : (
        isProtected && (
          <div className="protected-container">
            <h2 className="title">{t("redirectPage.protected.title")}</h2>
            <Image />
            <form onSubmit={handleSubmit(openUrl)}>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                onChange={() => clearErrors("password")}
                className={errors.password && "error-input"}
              />
              {errors.password && (
                <p className="error-input-message">
                  {t(errors.password.message!)}
                </p>
              )}
              <input type="submit" value={t("redirectPage.protected.button")} />
            </form>
          </div>
        )
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        limit={3}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default RedirectPage;
