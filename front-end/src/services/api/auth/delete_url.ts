import { RequestDeleteUrlBody } from "./types";

export const deleteUrl = async (
  authToken: string,
  body: RequestDeleteUrlBody
): Promise<number> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/deleteUrl`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    return response.status;
  } catch (error) {
    throw new Error(`deleteUrl: ${error}`);
  }
};
