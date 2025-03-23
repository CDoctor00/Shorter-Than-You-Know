import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formDeleteSchema,
  FormDeleteType,
} from "../../../services/zod/form/delete";
import "./Delete.css";

interface props {
  submitDelete: (data: FormDeleteType) => void;
  title: string;
}

const Delete = ({ submitDelete, title }: props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormDeleteType>({
    resolver: zodResolver(formDeleteSchema),
  });

  return (
    <div className="delete-container">
      <h2 className="title">{title}</h2>
      <form onSubmit={handleSubmit(submitDelete)}>
        <input
          type="password"
          placeholder="Enter the password to confirm"
          {...register("password")}
          onChange={() => clearErrors("password")}
          className={errors.password && "error-input"}
        />
        {errors.password && (
          <p className="error-input-message">{errors.password.message}</p>
        )}
        <input type="submit" value="Confirm delete" />
      </form>
    </div>
  );
};

export default Delete;
