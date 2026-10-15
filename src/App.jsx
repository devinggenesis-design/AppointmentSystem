import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Appointments from "./pages/admin/Appointments";
import Schedules from "./pages/admin/Schedules";
import Account from "./pages/admin/Account";
import CustomerLayout from "./layouts/CustomerLayout";

import Homepage from "./pages/customer/Homepage";
import Services from "./pages/customer/Services";
import Booking from "./pages/customer/Booking";
import Contacts from "./pages/customer/Contacts";
import Products from "./pages/customer/Products";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/products" element={<Products />} />
        </Route>

        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
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

        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
