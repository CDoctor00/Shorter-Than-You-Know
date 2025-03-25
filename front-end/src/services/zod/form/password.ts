import { z } from "zod";

export const formPasswordSchema = z.object({
  password: z.string({ message: "Password error" }).nonempty("zod.password"),
});

export type FormPasswordType = z.infer<typeof formPasswordSchema>;
