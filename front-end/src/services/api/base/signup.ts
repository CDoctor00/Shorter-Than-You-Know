import { RequestSignupBody } from "../auth/types";

export const signup = async (body: RequestSignupBody): Promise<number> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    return response.status;
  } catch (error) {
    throw new Error(`signup: ${error}`);
  }
};
