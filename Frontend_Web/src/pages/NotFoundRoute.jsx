import { Navigate } from "react-router-dom";

const NotFoundRoute = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loggedInUser) {
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

  return <Navigate to="/" />;
};

export default NotFoundRoute;
