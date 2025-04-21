import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function StockTab() {
  const [stocks, setStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [formData, setFormData] = useState({
    product_id: "",
    size: "",
    quantity: "",
    location: "",
  });

  // Simulasi data stok
  useEffect(() => {
    const dummyStocks = [
      {
        id: 1,
        product_id: "P001",
        size: "M",
        quantity: 50,
        location: "Gudang A",
      },
      {
        id: 2,
        product_id: "P002",
        size: "L",
        quantity: 30,
        location: "Gudang B",
      },
      {
        id: 3,
        product_id: "P003",
        size: "XL",
        quantity: 20,
        location: "Gudang A",
      },
    ];
    setStocks(dummyStocks);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStock) {
      // Update existing stock
      setStocks(
        stocks.map((stock) =>
          stock.id === currentStock.id ? { ...stock, ...formData } : stock
        )
      );
    } else {
      // Add new stock
      const newStock = {
        id: stocks.length + 1,
        ...formData,
      };
      setStocks([...stocks, newStock]);
    }
    setIsModalOpen(false);
    setFormData({ product_id: "", size: "", quantity: "", location: "" });
    setCurrentStock(null);
  };

  const handleEdit = (stock) => {
    setCurrentStock(stock);
    setFormData({
      product_id: stock.product_id,
      size: stock.size,
      quantity: stock.quantity,
      location: stock.location,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus stok ini?")) {
      setStocks(stocks.filter((stock) => stock.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manajemen Stok</h2>
        <button
          onClick={() => {
            setCurrentStock(null);
            setFormData({
              product_id: "",
              size: "",
              quantity: "",
              location: "",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus />
          <span>Tambah Stok</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Produk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ukuran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lokasi
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock) => (
              <tr key={stock.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {stock.product_id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{stock.size}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{stock.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{stock.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(stock)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(stock.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit Stock */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-black">
                {currentStock ? "Edit Stok" : "Tambah Stok Baru"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID Produk*
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black placeholder-gray-400"
                      value={formData.product_id}
                      onChange={(e) =>
                        setFormData({ ...formData, product_id: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ukuran*
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                      required
                    >
                      <option value="">Pilih Ukuran</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah*
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black placeholder-gray-400"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lokasi*
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black placeholder-gray-400"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
