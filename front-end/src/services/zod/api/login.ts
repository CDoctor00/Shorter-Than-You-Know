import { z } from "zod";

export const loginResponseSchema = z.object({
  accessToken: z.string({ message: "accessToken error" }).nonempty(),
  refreshToken: z.string({ message: "refreshToken error" }).nonempty(),
});
