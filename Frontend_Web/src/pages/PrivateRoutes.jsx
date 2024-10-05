import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    return <Navigate to="/" />; 
  }

  if (!allowedRoles.includes(loggedInUser.role)) {
    
    return (
      <Navigate
        to={
          loggedInUser.role === "admin"
            ? "/admin/productList"
            : "/cashier/billing"
        }
      />
    );
  }

  return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
