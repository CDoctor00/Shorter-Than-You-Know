import { RequestUpdateUserBody } from "./types";

export const updateUser = async (
  authToken: string,
  body: RequestUpdateUserBody
): Promise<number> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/updateUser`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    return response.status;
  } catch (error) {
    throw new Error(`updateUser: ${error}`);
  }
};
