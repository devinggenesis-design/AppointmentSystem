import { Outlet } from "react-router-dom";
import CustomerNavBar from "../components/CustomerNavBar";
import Footer from "../components/Footer";

export default function CustomerLayout() {
  return (
    <>
      <CustomerNavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
