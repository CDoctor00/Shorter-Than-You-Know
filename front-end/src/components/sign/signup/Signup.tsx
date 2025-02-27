import { FaFacebook, FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa6";
import "./Signup.css";

function SignUp({
  isOpen,
  toggleForm,
}: {
  isOpen: boolean;
  toggleForm: () => void;
}) {
  return (
    <div className="card-container">
      <label
        onClick={isOpen ? undefined : toggleForm}
        className={`card-label up ${isOpen ? "" : "close"}`}
      >
        Create Account
      </label>
      <form>
        <div className="input-container">
          <input type="text" name="name" placeholder="Name" />
          <input type="text" name="surname" placeholder="Surname" />
          <input type="email" name="email" placeholder="Email*" />
          <input type="password" name="password-1" placeholder="Password*" />
          <input
            type="password"
            name="password-2"
            placeholder="Repeat Password*"
          />
        </div>
        <input type="submit" value="Sign Up" />
      </form>
      <div className="icons">
        <FaFacebook className="icon" />
        <FaGoogle className="icon" />
        <FaLinkedin className="icon" />
        <FaGithub className="icon" />
      </div>
    </div>
  );
}

export default SignUp;
