import { z } from "zod";

export const formDeleteSchema = z.object({
  password: z
    .string({ message: "Password error" })
    .nonempty("A password could not be empty"),
});

export type FormDeleteType = z.infer<typeof formDeleteSchema>;
