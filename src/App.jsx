import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Appointments from "./pages/admin/Appointments";
import Schedules from "./pages/admin/Schedules";
import Account from "./pages/admin/Account";
import ProtectedRoute from "./components/common/ProtectedRoute";
import "./data/appointmentStore";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
