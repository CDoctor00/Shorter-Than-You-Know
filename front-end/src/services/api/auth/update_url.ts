import { RequestUrlBody, ResponseUpdateUrlBody } from "./types";
import { responseUpdateUrlSchema } from "../../zod/api/update_url";

export const updateUrl = async (
  authToken: string,
  body: RequestUrlBody
): Promise<ResponseUpdateUrlBody> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/updateUrl`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const resultsResponse = responseUpdateUrlSchema.safeParse(responseData);
    if (!resultsResponse.success) {
      throw new Error(
        resultsResponse.error.issues.map((issue) => issue.message).join(", ")
      );
    }

    return resultsResponse.data;
  } catch (error) {
    throw new Error(`updateUrl: ${error}`);
  }
};
