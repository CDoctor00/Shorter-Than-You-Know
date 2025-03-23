import { z } from "zod";

export const formLoginSchema = z.object({
  email: z
    .string({ message: "Email error" })
    .email("The entered value must be an email"),
  password: z
    .string({ message: "Password error" })
    .nonempty("A password could not be empty"),
});

export type FormLoginType = z.infer<typeof formLoginSchema>;
