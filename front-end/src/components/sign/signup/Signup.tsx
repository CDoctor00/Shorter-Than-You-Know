import { FaFacebook, FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa6";
import "./Signup.css";
import { useRef } from "react";
import { z } from "zod";

type SignupRequestBody = {
  email: string;
  password: string;
  name?: string;
  surname?: string;
};

function SignUp({
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
      password1: z.string({ message: "Password 1 error" }).min(1),
      password2: z.string({ message: "Password 2 error" }).min(1),
      name: z.string({ message: "Name error" }).optional(),
      surname: z.string({ message: "Surname error" }).optional(),
    });

    const resultsForm = formSchema.safeParse(formValues);
    if (!resultsForm.success) {
      console.error(resultsForm.error);
      return;
    }

    if (resultsForm.data.password1 !== resultsForm.data.password2) {
      console.error("The two passwords don't match");
      return;
    }

    const body: SignupRequestBody = {
      email: resultsForm.data.email,
      password: resultsForm.data.password1,
      name: resultsForm.data.name,
      surname: resultsForm.data.surname,
    };

    const response = await fetch("http://localhost:10000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(response);
      return;
    }

    ref.current?.reset();
  };

  return (
    <div className="card-container">
      <label
        onClick={isOpen ? undefined : toggleForm}
        className={`card-label up ${isOpen ? "" : "close"}`}
      >
        Create Account
      </label>
      <form ref={ref} onSubmit={onSubmit}>
        <div className="input-container">
          <input type="text" name="name" placeholder="Name" />
          <input type="text" name="surname" placeholder="Surname" />
          <input type="email" name="email" placeholder="Email*" />
          <input type="password" name="password1" placeholder="Password*" />
          <input
            type="password"
            name="password2"
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
