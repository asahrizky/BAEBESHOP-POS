import { useSales } from "../../hooks/useSales";
import { FiShoppingCart, FiPlus, FiMinus, FiX } from "react-icons/fi";

export default function SalesTab() {
  const {
    cart,
    customerName,
    setCustomerName,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
  } = useSales();

  // Contoh data produk
  const products = [
    { id: 1, name: "Kaos Polos Hitam", price: 120000 },
    { id: 2, name: "Celana Jeans", price: 250000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Proses Penjualan</h2>
        <p className="text-gray-500 mt-1">Catat transaksi penjualan baru</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-lg mb-4">Daftar Produk</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => addToCart(product)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{product.name}</h4>
                    <FiPlus className="text-gray-500" />
                  </div>
                  <p className="text-gray-600 mt-2">
                    Rp{product.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {cart.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium text-lg mb-4">Keranjang</h3>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between items-center p-3 border-b"
                  >
                    <div>
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-gray-600">
                        Rp{item.product.price.toLocaleString()} x{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <FiPlus />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-lg mb-4">Ringkasan</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Item:</span>
                <span>
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total Harga:</span>
                <span>Rp{calculateTotal().toLocaleString()}</span>
              </div>
              <div className="pt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pembeli
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Masukkan nama pembeli"
                />
              </div>
              <button
                onClick={() => {
                  if (cart.length === 0) return;
                  alert(
                    `Penjualan berhasil!\nPembeli: ${customerName}\nTotal: Rp${calculateTotal().toLocaleString()}`
                  );
                }}
                className={`w-full py-2 px-4 rounded-lg font-medium mt-4 ${
                  cart.length > 0
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Proses Penjualan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
