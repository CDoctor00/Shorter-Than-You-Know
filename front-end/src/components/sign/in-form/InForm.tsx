import { FaFacebook, FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa6";
import "./InForm.css";

function SignInForm({
  isOpen,
  toggleForm,
}: {
  isOpen: boolean;
  toggleForm: () => void;
}) {
  return (
    <div className={`sign-container in ${isOpen ? "open" : "close"}`}>
      <label
        onClick={isOpen ? undefined : toggleForm}
        className={`sign-label in ${isOpen ? "" : "close"}`}
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

export default SignInForm;
