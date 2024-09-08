import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";

import AdminLayout from "./layouts/Admin";
import CashierLayout from "./layouts/Cashier";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/cashier/*" element={<CashierLayout />} />
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
