import { RequestDeleteUserBody } from "./types";

export const deleteUser = async (
  authToken: string,
  body: RequestDeleteUserBody
): Promise<number> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/deleteUser`,
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
    throw new Error(`deleteUser: ${error}`);
  }
};
