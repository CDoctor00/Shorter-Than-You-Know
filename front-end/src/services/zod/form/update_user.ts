import { z } from "zod";

export const formUpdateUserSchema = z.object({
  password: z.string({ message: "Password error" }).nonempty("zod.password"),
  newPassword: z
    .string({ message: "New password error" })
    .optional()
    .transform((val) => val || undefined),
  name: z
    .string({ message: "Name error" })
    .optional()
    .transform((val) => val || undefined),
  surname: z
    .string({ message: "Surname error" })
    .optional()
    .transform((val) => val || undefined),
});

export type FormUpdateUserType = z.infer<typeof formUpdateUserSchema>;
