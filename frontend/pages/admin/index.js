import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import ProductsTab from "../../components/admin/ProductsTab";
import SalesTab from "../../components/admin/SalesTab";
import ReportsTab from "../../components/admin/ReportsTab";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <AdminLayout
      title="Admin Panel"
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "sales" && <SalesTab />}
        {activeTab === "reports" && <ReportsTab />}
      </div>
    </AdminLayout>
  );
}
