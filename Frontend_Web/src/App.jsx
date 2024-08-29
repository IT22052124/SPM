import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";

import AdminLayout from "./layouts/Admin";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
