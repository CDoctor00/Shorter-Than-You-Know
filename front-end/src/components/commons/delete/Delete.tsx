import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formPasswordSchema,
  FormPasswordType,
} from "../../../services/zod/form/password";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "./Delete.css";

interface props {
  submitDelete: (data: FormPasswordType) => void;
  hasPassword: boolean;
  title: string;
}

const Delete = ({ submitDelete, title, hasPassword }: props) => {
  const { t } = useTranslation();

  const { register, handleSubmit } = useForm<FormPasswordType>({
    resolver: zodResolver(formPasswordSchema),
  });

  return (
    <div className="delete-container">
      <h2>{title}</h2>
      <p>{t("commons.delete.text")}</p>
      <form onSubmit={handleSubmit(submitDelete)}>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          style={hasPassword ? {} : { display: "none" }}
        />
        <input type="submit" value={t("commons.delete.button")} />
      </form>

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
};

export default Delete;
