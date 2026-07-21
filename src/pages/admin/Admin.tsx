import { useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import AdminDashboard from "./AdminDashboard";

const Admin = () => {
  useEffect(() => {
    document.title = "Admin Dashboard — PONTAL Carapitangui";
  }, []);

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default Admin;
