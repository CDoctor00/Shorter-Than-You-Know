import { ResponseHistory } from "./types";
import { historyResponseSchema } from "../../zod/api/history";

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

    const resultsResponse = historyResponseSchema.safeParse(responseData);
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
