import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiDollarSign,
  FiList,
  FiLogOut,
} from "react-icons/fi";

export default function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Produk", icon: <FiShoppingBag />, path: "/admin?tab=products" },
    { name: "Penjualan", icon: <FiDollarSign />, path: "/admin?tab=sales" },
    { name: "Rekap", icon: <FiList />, path: "/admin?tab=reports" },
  ];

  const currentTab = router.query.tab || "products";

  const handleLogout = () => {
    // Logout logic
    router.push("/");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-lg transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out z-40 flex flex-col ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 flex items-center justify-between">
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-gray-800">Toko Baju</h1>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block p-2 rounded-full hover:bg-gray-100"
            >
              {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
            </button>
          </div>

          <nav className="mt-6">
            <ul>
              {menuItems.map((item) => (
                <li key={item.name} className="px-4 py-2">
                  <Link
                    href={item.path}
                    className={`flex items-center p-2 rounded-lg ${
                      currentTab === item.path.split("=")[1]
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!isCollapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <FiLogOut size={20} />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
