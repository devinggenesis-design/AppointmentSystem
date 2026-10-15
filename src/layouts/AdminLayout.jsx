import { Outlet } from "react-router-dom";
import AdminNavBar from "../components/admin/AdminNavBar";
import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminNavBar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
