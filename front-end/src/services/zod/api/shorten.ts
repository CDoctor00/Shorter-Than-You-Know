import { z } from "zod";

export const responseShortenSchema = z.object({
  longUrl: z.string({ message: "longUrl error" }).nonempty(),
  shortID: z.string({ message: "shortID error" }).nonempty(),
});
