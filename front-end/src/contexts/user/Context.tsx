import { createContext } from "react";
import { User } from "../../types/token";

interface context {
  user: User | undefined;
  updateUserInfo: (name?: string, surname?: string) => void;
  loginUser: (token: string) => void;
  logoutUser: () => void;
}

export const UserContext = createContext<context>({
  user: undefined,
  updateUserInfo: () => {},
  loginUser: () => {},
  logoutUser: () => {},
});
