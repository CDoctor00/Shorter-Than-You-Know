import { useState } from "react";
import LoginForm from "../login/Login";
import SignUp from "../signup/Signup";
import "./Page.css";

function SignPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="sign-page">
      <div className="sign-container">
        <SignUp isOpen={isSignUp} toggleForm={toggleForm} />
        <LoginForm isOpen={!isSignUp} toggleForm={toggleForm} />
      </div>
    </div>
  );
}

export default SignPage;
