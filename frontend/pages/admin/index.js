import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/AdminLayout";
import ProductsTab from "../../components/admin/ProductsTab";
import SalesTab from "../../components/admin/SalesTab";
import ReportsTab from "../../components/admin/ReportsTab";
import { isAuthenticated, getAuthToken } from "@/utils/auth";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("products");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      console.log("Current token:", token); // Debug log

      if (!token) {
        console.log("No token found, redirecting to login");
        router.push("/");
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsLoading(false);
        } else {
          console.log("Token verification failed, redirecting to login");
          router.push("/");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout
      title="Halaman Produk"
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
