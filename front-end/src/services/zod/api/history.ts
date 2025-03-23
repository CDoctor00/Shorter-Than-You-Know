import { z } from "zod";

const historyItemSchema = z.object({
  longUrl: z.string({ message: "longUrl error" }).nonempty(),
  shortID: z.string({ message: "shortID error" }).nonempty(),
  uuid: z.string({ message: "uuid error" }).nonempty(),
  isEnabled: z.boolean({ message: "isEnabled error" }),
  createTime: z.string({ message: "createdTime error" }).nonempty(),
  updateTime: z.string({ message: "lastUpdateTime error" }).nonempty(),
  prefix: z
    .string({ message: "prefix error" })
    .optional()
    .transform((val) => val || undefined),
  expirationTime: z
    .string({ message: "expirationTime error" })
    .optional()
    .transform((val) => val || undefined),
  note: z
    .string({ message: "note error" })
    .optional()
    .transform((val) => val || undefined),
  clicks: z
    .number({ message: "clicks error" })
    .optional()
    .transform((val) => val || undefined),
});

export const historyResponseSchema = z.array(historyItemSchema);
