import { FaFacebook, FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa6";
import "./Login.css";

function LoginForm({
  isOpen,
  toggleForm,
}: {
  isOpen: boolean;
  toggleForm: () => void;
}) {
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
      <form>
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
