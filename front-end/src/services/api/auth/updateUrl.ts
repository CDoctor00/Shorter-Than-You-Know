import { z } from "zod";
import { RequestUrlBody, ResponseUpdateUrlBody } from "./types";

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

    const responseSchema = z.object({
      longUrl: z.string({ message: "longUrl error" }).nonempty(),
      shortID: z.string({ message: "shortID error" }).nonempty(),
      updateTime: z.string({ message: "updateTime error" }).nonempty(),
    });

    const resultsResponse = responseSchema.safeParse(responseData);
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
