import { FaFacebook, FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa6";
import { z } from "zod";
import { useContext, useRef } from "react";
import { login } from "../../../services/api/base/login";
import { localStorageManager } from "../../../services/system/localStorage";
import { UserContext } from "../../../contexts/user/Context";
import { RequestLoginBody } from "../../../services/api/auth/types";
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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData);

    const formSchema = z.object({
      email: z.string({ message: "Email error" }).email(),
      password: z.string({ message: "Password error" }).min(1),
    });

    const resultsForm = formSchema.safeParse(formValues);
    if (!resultsForm.success) {
      console.error(resultsForm.error);
      return;
    }

    const body: RequestLoginBody = {
      email: resultsForm.data.email,
      password: resultsForm.data.password,
    };

    login(body)
      .then((response) => {
        localStorageManager.setAccessToken(response.accessToken);
        localStorageManager.setRefreshToken(response.refreshToken);

        loginUser(response.accessToken);
        ref.current?.reset();
        //TODO redirect
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
      <form onSubmit={onSubmit} ref={ref}>
        <div className="inputs-container">
          <input type="email" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
        </div>
        <input type="submit" value="Sign In" />
        <div className="icons">
          <FaFacebook className="icon" />
          <FaGoogle className="icon" />
          <FaLinkedin className="icon" />
          <FaGithub className="icon" />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
