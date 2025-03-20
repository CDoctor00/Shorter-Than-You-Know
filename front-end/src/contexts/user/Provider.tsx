import { useEffect, useState } from "react";
import { UserContext } from "./Context";
import { checkTokens, validateToken } from "../../services/api/utils/tokens";
import { localStorageManager } from "../../services/system/localStorage";
import { User } from "../../types/token";

interface props {
  children: React.ReactNode;
}

const UserContextProvider = (props: props) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const check = checkTokens();
    if (!check) {
      localStorageManager.clearData();
      return;
    }
    setUser(localStorageManager.getUserInfo());
  }, []);

  const loginUser = (token: string) => {
    const result = validateToken(token);
    if (result.isValid) {
      setUser(result.token!.user);
      localStorageManager.setUserInfo(result.token!.user);
    }
  };

  const logoutUser = () => {
    localStorageManager.clearData();
    setUser(undefined);
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
      value={{ user, loginUser, logoutUser, updateUserInfo }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
