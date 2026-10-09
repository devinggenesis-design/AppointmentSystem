import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Appointments from "./pages/admin/Appointments";
import Schedules from "./pages/admin/Schedules";
import Account from "./pages/admin/Account";

// Customer
import ClientLay from "./layouts/clientLay";
import Homepage from "./pages/customer/Homepage";
import Services from "./pages/customer/Services";
import Booking from "./pages/customer/Booking";
import Contacts from "./pages/customer/Contacts";
import "./data/appointmentStore";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer pages */}
        <Route element={<ClientLay />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contacts" element={<Contacts />} />
        </Route>

        {/* Admin: login has no navbar */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin: all other pages have the navbar */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;