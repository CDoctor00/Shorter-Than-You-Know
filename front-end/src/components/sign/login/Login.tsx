import { FaFacebook, FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa6";
import { useContext, useRef } from "react";
import { login } from "../../../services/api/base/login";
import { localStorageManager } from "../../../services/system/local_storage";
import { UserContext } from "../../../contexts/user/Context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formLoginSchema,
  FormLoginType,
} from "../../../services/zod/form/login";
import { ToastContainer, toast } from "react-toastify";
import "./Login.css";

function LoginForm({
  isOpen,
  toggleForm,
}: {
  isOpen: boolean;
  toggleForm: () => void;
}) {
  const ref = useRef<HTMLFormElement | null>(null);
  const { loginUser } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormLoginType>({
    resolver: zodResolver(formLoginSchema),
  });

  const onSubmit = async (data: FormLoginType) => {
    login({
      email: data.email,
      password: data.password,
    })
      .then((response) => {
        if (response.status == 200) {
          localStorageManager.setAccessToken(response.data!.accessToken);
          localStorageManager.setRefreshToken(response.data!.refreshToken);

          loginUser(response.data!.accessToken);
          ref.current?.reset();
        } else if (response.status >= 400) {
          toast.error("Wrong email or password");
        }
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  };

  return (
    <div
      className={`card-container down ${isOpen ? "open" : "close"}`}
      id="login-container"
    >
      <label
        onClick={isOpen ? undefined : toggleForm}
        className={`card-label down ${isOpen ? "" : "close"}`}
      >
        Sign In
      </label>
      <form onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <div className="inputs-container">
          <input
            type="text"
            placeholder="Email"
            {...register("email")}
            className={errors.email && "error-input"}
            onChange={() => clearErrors("email")}
          />
          {errors.email && (
            <p className="error-input-message">{errors.email.message}</p>
          )}
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={errors.password && "error-input"}
            onChange={() => clearErrors("password")}
          />
          {errors.password && (
            <p className="error-input-message">{errors.password.message}</p>
          )}
        </div>
        <input type="submit" value="Sign In" />
        <div className="icons">
          <FaFacebook className="icon" />
          <FaGoogle className="icon" />
          <FaLinkedin className="icon" />
          <FaGithub className="icon" />
        </div>
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
}

export default LoginForm;
