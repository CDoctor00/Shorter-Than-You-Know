import { z } from "zod";

export const formLoginSchema = z.object({
  email: z.string({ message: "Email error" }).email("zod.email"),
  password: z.string({ message: "Password error" }).nonempty("zod.password"),
});

export type FormLoginType = z.infer<typeof formLoginSchema>;
