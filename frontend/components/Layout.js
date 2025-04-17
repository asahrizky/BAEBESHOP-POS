import Head from "next/head";
import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiShoppingBag,
  FiDollarSign,
  FiList,
  FiLogOut,
} from "react-icons/fi";

export default function Layout({ children, title = "Toko Baju" }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Aplikasi Penjualan Baju" />
      </Head>

      <div className="flex h-screen bg-gray-100">
        {/* Mobile sidebar backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed md:relative z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
            ${
              mobileSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }
            ${!sidebarOpen && "md:w-20"}
          `}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-between">
              {sidebarOpen && (
                <h1 className="text-xl font-bold text-gray-800">Toko Baju</h1>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden md:block p-2 rounded-full hover:bg-gray-100"
              >
                {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-1 px-2">
                <SidebarItem
                  icon={<FiShoppingBag size={20} />}
                  text="Produk"
                  active={true}
                  expanded={sidebarOpen}
                  onClick={() => setMobileSidebarOpen(false)}
                />
                <SidebarItem
                  icon={<FiDollarSign size={20} />}
                  text="Penjualan"
                  expanded={sidebarOpen}
                  onClick={() => setMobileSidebarOpen(false)}
                />
                <SidebarItem
                  icon={<FiList size={20} />}
                  text="Rekap"
                  expanded={sidebarOpen}
                  onClick={() => setMobileSidebarOpen(false)}
                />
              </ul>
            </nav>

            <div className="p-4 border-t">
              <button className="flex items-center w-full p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <FiLogOut size={20} />
                {sidebarOpen && <span className="ml-3">Logout</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <header className="md:hidden bg-white shadow-sm p-4 flex items-center">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="ml-4 text-xl font-semibold">{title}</h1>
          </header>

          {/* Content area */}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

function SidebarItem({ icon, text, active = false, expanded, onClick }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full p-3 rounded-lg transition-colors
          ${
            active
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        <span>{icon}</span>
        {expanded && <span className="ml-3">{text}</span>}
      </button>
    </li>
  );
}
