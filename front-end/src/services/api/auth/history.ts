import { z } from "zod";
import { ResponseHistory } from "./types";

export const getHistory = async (
  authToken: string
): Promise<ResponseHistory> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/userHistory`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const singleSchema = z.object({
      longUrl: z.string({ message: "longUrl error" }),
      shortID: z.string({ message: "shortID error" }),
      uuid: z.string({ message: "uuid error" }),
      isEnabled: z.boolean({ message: "status error" }),
      createTime: z.string({ message: "createdTime error" }),
      updateTime: z.string({ message: "lastUpdateTime error" }),
      prefix: z
        .string({ message: "prefix error" })
        .optional()
        .transform((val) => val || undefined),
      expirationTime: z
        .string({ message: "expirationTime error" })
        .optional()
        .transform((val) => val || undefined),
      password: z
        .string({ message: "password error" })
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
    const responseSchema = z.array(singleSchema);

    const resultsResponse = responseSchema.safeParse(responseData);
    if (!resultsResponse.success) {
      throw new Error(
        resultsResponse.error.issues.map((issue) => issue.message).join(", ")
      );
    }

    return resultsResponse.data;
  } catch (error) {
    throw new Error(`gethistory: ${error}`);
  }
};
