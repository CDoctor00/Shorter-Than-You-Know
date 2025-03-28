import { z } from "zod";

export const formPasswordSchema = z.object({
  password: z.string({ message: "Password error" }).optional(),
});

export type FormPasswordType = z.infer<typeof formPasswordSchema>;
