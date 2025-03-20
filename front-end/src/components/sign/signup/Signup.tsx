import { FaFacebook, FaGithub, FaGoogle, FaLinkedin } from "react-icons/fa6";
import { useRef } from "react";
import { z } from "zod";
import { signup } from "../../../services/api/base/signup";
import "./Signup.css";

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
      password1: z.string({ message: "Password 1 error" }).nonempty(),
      password2: z.string({ message: "Password 2 error" }).nonempty(),
      name: z
        .string({ message: "Name error" })
        .optional()
        .transform((val) => val || undefined),
      surname: z
        .string({ message: "Surname error" })
        .optional()
        .transform((val) => val || undefined),
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

    signup({
      email: resultsForm.data.email,
      password: resultsForm.data.password1,
      name: resultsForm.data.name,
      surname: resultsForm.data.surname,
    })
      .then(() => {
        ref.current?.reset();
      })
      .catch((error) => {
        console.error(error);
        return;
      });
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
        <div className="inputs-container">
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
