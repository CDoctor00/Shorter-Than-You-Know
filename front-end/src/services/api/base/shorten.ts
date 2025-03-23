import { RequestUrlBody, ResponseShortenBody } from "../auth/types";
import { responseShortenSchema } from "../../zod/api/shorten";

export const shorten = async (
  authToken: string | undefined,
  body: RequestUrlBody
): Promise<ResponseShortenBody> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/shorten`,
      {
        method: "POST",
        headers: authToken
          ? {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            }
          : { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const resultsResponse = responseShortenSchema.safeParse(responseData);
    if (!resultsResponse.success) {
      throw new Error(
        resultsResponse.error.issues.map((issue) => issue.message).join(", ")
      );
    }

    return resultsResponse.data;
  } catch (error) {
    throw new Error(`shorten: ${error}`);
  }
};
