import { z } from "zod";

export const formUrlSchema = z.object({
  url: z
    .string({ message: "URL error" })
    .nonempty("zod.formUrl.url.empty")
    .max(2100, "zod.formUrl.url.long"),
  password: z
    .string({ message: "password error" })
    .optional()
    .transform((val) => val || undefined),
  enable: z.boolean({ message: "enable error" }),
  prefix: z
    .string({ message: "prefix error" })
    .max(10, "zod.formUrl.prefix")
    .optional()
    .transform((val) => val || undefined),
  note: z
    .string({ message: "note error" })
    .max(500, "zod.formUrl.note")
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
