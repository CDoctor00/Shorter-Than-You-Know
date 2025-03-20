import { z } from "zod";
import { RequestLoginBody, ResponseLoginBody } from "../auth/types";

export const login = async (
  body: RequestLoginBody
): Promise<ResponseLoginBody> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseSchema = z.object({
      accessToken: z.string({ message: "accessToken error" }).nonempty(),
      refreshToken: z.string({ message: "refreshToken error" }).nonempty(),
    });

    const resultsResponse = responseSchema.safeParse(responseData);
    if (!resultsResponse.success) {
      throw new Error(
        resultsResponse.error.issues.map((issue) => issue.message).join(", ")
      );
    }

    return resultsResponse.data;
  } catch (error) {
    throw new Error(`login: ${error}`);
  }
};
