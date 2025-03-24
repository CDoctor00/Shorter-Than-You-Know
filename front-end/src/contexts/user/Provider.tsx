import { useState } from "react";
import { UserContext } from "./Context";
import { checkTokens, validateToken } from "../../services/api/utils/tokens";
import { localStorageManager } from "../../services/system/local_storage";
import { User } from "../../types/token";

interface props {
  children: React.ReactNode;
}

const UserContextProvider = (props: props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(() => {
    const check = checkTokens();
    if (!check) {
      localStorageManager.clearData();
    } else {
      const user = localStorageManager.getUserInfo();
      if (user) {
        setIsAuthenticated(true);
        return user;
      }
    }

    setIsAuthenticated(false);
    return { email: "", id: "" };
  });

  const loginUser = (token: string) => {
    const result = validateToken(token);
    if (result.isValid) {
      setUser(result.token!.user);
      localStorageManager.setUserInfo(result.token!.user);
      setIsAuthenticated(true);
    }
  };

  const logoutUser = () => {
    localStorageManager.clearData();
    setIsAuthenticated(false);
    setUser({ email: "", id: "" });
  };

  const updateUserInfo = (newName?: string, newSurname?: string) => {
    const newUser = {
      ...user,
      name: newName,
      surname: newSurname,
    } as User;

    setUser(newUser);
    localStorageManager.setUserInfo(newUser);
  };

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, loginUser, logoutUser, updateUserInfo }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
