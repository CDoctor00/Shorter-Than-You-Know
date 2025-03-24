import { z } from "zod";

export const formPasswordSchema = z.object({
  password: z
    .string({ message: "Password error" })
    .nonempty("A password could not be empty"),
});

export type FormPasswordType = z.infer<typeof formPasswordSchema>;
