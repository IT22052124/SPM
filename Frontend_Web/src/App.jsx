import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import AdminLayout from "./layouts/Admin";
import CashierLayout from "./layouts/Cashier";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/PrivateRoutes";
import NotFoundRoute from "./pages/NotFoundRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier/*"
          element={
            <ProtectedRoute allowedRoles={["cashier"]}>
              <CashierLayout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </Router>
  );
}

export default App;
