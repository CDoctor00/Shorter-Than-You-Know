import { z } from "zod";

export const responseRedirectSchema = z.object({
  longUrl: z.string({ message: "longUrl error" }).nonempty(),
});
