import { RequestDeleteUrlBody } from "./types";

export const deleteUrl = async (
  authToken: string,
  body: RequestDeleteUrlBody
): Promise<undefined> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/deleteUrl`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return;
  } catch (error) {
    throw new Error(`deleteUrl: ${error}`);
  }
};
