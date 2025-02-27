import { FaFacebook, FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa6";
import "./Login.css";
import { z } from "zod";
import { useRef } from "react";

type LoginRequestBody = {
  email: string;
  password: string;
};

function LoginForm({
  isOpen,
  toggleForm,
}: {
  isOpen: boolean;
  toggleForm: () => void;
}) {
  const ref = useRef<HTMLFormElement | null>(null);

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

    const body: LoginRequestBody = {
      email: resultsForm.data.email,
      password: resultsForm.data.password,
    };

    const response = await fetch("http://localhost:10000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();
    if (!response.ok) {
      console.error(response);
    }

    const responseSchema = z.object({
      accessToken: z.string({ message: "accessToken error" }).min(1),
      refreshToken: z.string({ message: "refreshToken error" }).min(1),
    });

    const resultsResponse = responseSchema.safeParse(responseData);
    if (!resultsResponse.success) {
      console.error(resultsResponse.error);
      return;
    }

    sessionStorage.setItem("access_token", resultsResponse.data.accessToken);
    localStorage.setItem("refresh_token", resultsResponse.data.refreshToken);

    ref.current?.reset();
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
        <div className="input-container">
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
