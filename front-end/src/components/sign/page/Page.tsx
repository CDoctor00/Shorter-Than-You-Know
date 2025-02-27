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
      <SignUp isOpen={isSignUp} toggleForm={toggleForm} />
      <LoginForm isOpen={!isSignUp} toggleForm={toggleForm} />
    </div>
  );
}

export default SignPage;
