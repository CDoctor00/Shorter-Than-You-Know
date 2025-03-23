import { z } from "zod";

export const responseRefrehTokenSchema = z.object({
  accessToken: z.string({ message: "accessToken error" }).nonempty(),
});
