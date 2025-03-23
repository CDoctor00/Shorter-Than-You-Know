import { responseRefrehTokenSchema } from "../../zod/api/refresh_token";

export const refreshToken = async (refreshToken: string): Promise<string> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refreshToken`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const resultsResponse = responseRefrehTokenSchema.safeParse(responseData);
    if (!resultsResponse.success) {
      throw new Error(
        resultsResponse.error.issues.map((issue) => issue.message).join(", ")
      );
    }

    return resultsResponse.data.accessToken;
  } catch (error) {
    throw new Error(`refreshToken: ${error}`);
  }
};
