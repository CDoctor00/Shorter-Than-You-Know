import { RequestLoginBody, ResponseLoginBody } from "../auth/types";
import { loginResponseSchema } from "../../zod/api/login";

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

    const resultsResponse = loginResponseSchema.safeParse(responseData);
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
