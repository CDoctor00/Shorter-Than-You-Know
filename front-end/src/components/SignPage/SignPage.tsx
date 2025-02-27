import { useState } from "react";
import SignInForm from "../SignInForm/SignInForm";
import SignUpForm from "../SignUpForm/SignUpForm";
import "./SignPage.css";

function SignPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="sign-page">
      <SignUpForm isOpen={isSignUp} toggleForm={toggleForm} />
      <SignInForm isOpen={!isSignUp} toggleForm={toggleForm} />
    </div>
  );
}

export default SignPage;
