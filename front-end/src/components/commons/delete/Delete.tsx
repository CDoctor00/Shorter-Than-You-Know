import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formPasswordSchema,
  FormPasswordType,
} from "../../../services/zod/form/password";
import { useTranslation } from "react-i18next";
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
    </div>
  );
};

export default Delete;
