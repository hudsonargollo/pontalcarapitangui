import { AdminWaiterReports } from "@/components";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";

const AdminWaiterReportsPage = () => {
  const navigate = useNavigate();
  
  // Check if bypass parameter is present
  const urlParams = new URLSearchParams(window.location.search);
  const bypassParam = urlParams.get('bypass');
  const bypassSuffix = bypassParam ? `?bypass=${bypassParam}` : '';

  const handleBack = () => {
    navigate(`/admin${bypassSuffix}`);
  };

  return (
    <AdminLayout>
      <AdminWaiterReports />
    </AdminLayout>
  );
};

export default AdminWaiterReportsPage;