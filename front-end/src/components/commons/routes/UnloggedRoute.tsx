// front-end/src/components/PrivateRoute.tsx
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../../../contexts/user/Context";

interface props {
  children: React.ReactNode;
}

const UnloggedRoute = ({ children }: props) => {
  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user");
    }
  }, [isAuthenticated]);

  return children;
};

export default UnloggedRoute;
