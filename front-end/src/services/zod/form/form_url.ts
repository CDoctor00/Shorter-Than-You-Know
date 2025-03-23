import { z } from "zod";

export const formUrlSchema = z.object({
  url: z
    .string({ message: "URL error" })
    .nonempty()
    .max(2100, "The system doesn't accept an URL longer than 2100 characters"),
  password: z
    .string({ message: "password error" })
    .optional()
    .transform((val) => val || undefined),
  enable: z
    .string({ message: "enable error" })
    .optional()
    .transform((val) => val || undefined),
  prefix: z
    .string({ message: "prefix error" })
    .max(10, "The url prefix could not be longer than 10 chars")
    .regex(new RegExp("[W]"))
    .optional()
    .transform((val) => val || undefined),
  note: z
    .string({ message: "note error" })
    .max(500, "A note could not be longer than 500 chars")
    .optional()
    .transform((val) => val || undefined),
  date: z
    .string({ message: "date error" })
    .optional()
    .transform((val) => val || undefined),
  time: z
    .string({ message: "time error" })
    .optional()
    .transform((val) => val || undefined),
});
export type FormUrlType = z.infer<typeof formUrlSchema>;
