import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formPasswordSchema,
  FormPasswordType,
} from "../../../services/zod/form/password";
import "./Delete.css";
import { useTranslation } from "react-i18next";

interface props {
  submitDelete: (data: FormPasswordType) => void;
  title: string;
}

const Delete = ({ submitDelete, title }: props) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormPasswordType>({
    resolver: zodResolver(formPasswordSchema),
  });

  return (
    <div className="delete-container">
      <h2 className="title">{title}</h2>
      <form onSubmit={handleSubmit(submitDelete)}>
        <input
          type="password"
          placeholder={t("commons.delete.placeholder")}
          {...register("password")}
          onChange={() => clearErrors("password")}
          className={errors.password && "error-input"}
        />
        {errors.password && (
          <p className="error-input-message">{t(errors.password.message!)}</p>
        )}
        <input type="submit" value={t("commons.delete.button")} />
      </form>
    </div>
  );
};

export default Delete;
