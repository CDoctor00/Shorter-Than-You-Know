import { RequestDeleteUserBody } from "./types";

export const deleteUser = async (
  authToken: string,
  body: RequestDeleteUserBody
): Promise<undefined> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/deleteUser`,
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
    throw new Error(`deleteUser: ${error}`);
  }
};
