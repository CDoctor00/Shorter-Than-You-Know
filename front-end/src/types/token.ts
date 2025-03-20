export interface JWT {
  exp: number;
  iat: number;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
}

export interface TokenValidationResult {
  isValid: boolean;
  token?: JWT;
}
