import { createContext } from "react";
import { User } from "../../types/token";

interface context {
  user: User;
  isAuthenticated: boolean;
  updateUserInfo: (name?: string, surname?: string) => void;
  loginUser: (token: string) => void;
  logoutUser: () => void;
}

export const UserContext = createContext<context>({
  user: { email: "", id: "" },
  isAuthenticated: false,
  updateUserInfo: () => {},
  loginUser: () => {},
  logoutUser: () => {},
});
