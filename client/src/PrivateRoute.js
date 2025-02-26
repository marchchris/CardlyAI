import { useContext } from "react";
import { AuthContext } from "./config/AuthProvider";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import Loading from "./components/loadingScreen";

const PrivateRoute = ({ children }) => {
  const { loading, user } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (user) {
    if (!user.emailVerified) {
      return <h1>You must verify email</h1>
    }
    return children;
  }

  return <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;