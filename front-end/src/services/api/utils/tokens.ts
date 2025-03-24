import { JWT, TokenValidationResult } from "../../../types/token";
import { refreshToken } from "../auth/refresh_token";
import { localStorageManager } from "../../system/local_storage";

/**
 * Retrieves the current access token. If expired or not present,
 * attempts to refresh the token.
 *
 * @returns {string | undefined} The access token if valid or available, otherwise `undefined`.
 */
export const getToken = (): string | undefined => {
  let token = localStorageManager.getAccessToken();
  if (!token) {
    return undefined;
  }

  let validatedToken = validateToken(token);
  if (validatedToken.isValid) {
    return token;
  }

  token = localStorageManager.getRefreshToken();
  if (!token) {
    return undefined;
  }

  validatedToken = validateToken(token);
  if (validatedToken.isValid) {
    refreshToken(token)
      .then((accessToken) => {
        localStorageManager.setAccessToken(accessToken);
        return accessToken;
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  }
};

/**
 * Checks the validity of the refresh token.
 *
 * @returns {boolean} - `true` if the refresh token is valid, `false` otherwise.
 */
export const checkTokens = (): boolean => {
  const token = localStorageManager.getRefreshToken();
  if (!token) {
    return false;
  }

  const validatedToken = validateToken(token);
  return validatedToken.isValid;
};

/**
 * Validates a JWT token and returns its validity status along with the payload.
 *
 * @param {string} token - The JWT token to validate.
 * @returns {TokenValidationResult} An object indicating whether the token is valid and optionally containing the token payload.
 */
export const validateToken = (token: string): TokenValidationResult => {
  try {
    const arrayToken = token.split(".");
    const payload: JWT = JSON.parse(atob(arrayToken[1]));

    const isExpired = Math.floor(new Date().getTime() / 1000) >= payload.exp;

    return {
      isValid: !isExpired,
      token: isExpired ? undefined : payload,
    };
  } catch (error) {
    console.error(error);
    return {
      isValid: false,
    };
  }
};
