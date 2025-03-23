import { z } from "zod";

export const responseUpdateUrlSchema = z.object({
  longUrl: z.string({ message: "longUrl error" }).nonempty(),
  shortID: z.string({ message: "shortID error" }).nonempty(),
  updateTime: z.string({ message: "updateTime error" }).nonempty(),
});
