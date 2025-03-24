// front-end/src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../contexts/user/Context";

interface props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: props) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/sign" replace />;
  }

  return children;
};

export default PrivateRoute;
