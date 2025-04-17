import { FiShoppingBag, FiDollarSign, FiList, FiLogOut } from "react-icons/fi";

export default function AdminLayout({
  children,
  title,
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    { id: "products", icon: <FiShoppingBag />, label: "Produk" },
    { id: "sales", icon: <FiDollarSign />, label: "Penjualan" },
    { id: "reports", icon: <FiList />, label: "Rekap" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Toko Baju</h1>
        </div>

        <nav className="p-2">
          <ul className="space-y-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="ml-3">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button className="flex items-center w-full p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FiLogOut />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
