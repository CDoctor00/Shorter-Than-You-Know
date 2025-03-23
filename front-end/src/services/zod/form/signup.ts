import { z } from "zod";

export const formSignupSchema = z
  .object({
    email: z
      .string({ message: "Email error" })
      .email("The entered value must be an email"),
    password1: z
      .string({ message: "Password 1 error" })
      .nonempty("A password could not be empty"),
    password2: z
      .string({ message: "Password 2 error" })
      .nonempty("A password could not be empty"),
    name: z
      .string({ message: "Name error" })
      .optional()
      .transform((val) => val || undefined),
    surname: z
      .string({ message: "Surname error" })
      .optional()
      .transform((val) => val || undefined),
  })
  .refine(({ password1, password2 }) => password1 === password2, {
    path: ["password2"],
    message: "Passwords do not match",
  });

export type FormSignupType = z.infer<typeof formSignupSchema>;
