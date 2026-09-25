import { useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { BannerManagement } from "@/components/admin/BannerManagement";

const AdminBanners = () => {
  useEffect(() => {
    document.title = "Banners do Menu — Admin PONTAL";
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <BannerManagement />
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;
