import { useState } from "react";
import SignInForm from "../in-form/InForm";
import SignUpForm from "../up-form/UpForm";
import "./Page.css";

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
