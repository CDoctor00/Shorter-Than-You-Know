import { RequestSignupBody } from "../auth/types";

export const signup = async (body: RequestSignupBody): Promise<undefined> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return;
  } catch (error) {
    throw new Error(`signup: ${error}`);
  }
};
