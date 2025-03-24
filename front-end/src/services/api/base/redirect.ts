import { responseRedirectSchema } from "../../zod/api/redirect";
import { RequestRedirectBody, ResponseRedirectBody } from "../auth/types";

export const redirect = async (
  body: RequestRedirectBody
): Promise<ResponseRedirectBody> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/redirect`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      return {
        status: response.status,
        longUrl: "",
      };
    }

    const resultsResponse = responseRedirectSchema.safeParse(responseData);
    if (!resultsResponse.success) {
      throw new Error(
        resultsResponse.error.issues.map((issue) => issue.message).join(", ")
      );
    }

    return { longUrl: resultsResponse.data.longUrl, status: response.status };
  } catch (error) {
    throw new Error(`signup: ${error}`);
  }
};
