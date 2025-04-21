import { useState, useEffect } from "react";
import {
  FiBox,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUpload,
  FiX,
} from "react-icons/fi";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/api";

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sizes, setSizes] = useState([
    { size: "S", price: 0 },
    { size: "M", price: 0 },
    { size: "L", price: 0 },
    { size: "XL", price: 0 },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    base_price: "",
    image_url: "",
    size_prices: {},
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        // Pastikan response.data adalah array
        if (Array.isArray(response.data)) {
          setProducts(
            response.data.map((product) => ({
              ...product,
              size_prices:
                typeof product.size_prices === "string"
                  ? JSON.parse(product.size_prices)
                  : product.size_prices || {},
            }))
          );
        } else {
          console.error("Invalid response format:", response.data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle image upload (simulasi)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simpan URL gambar (di production, upload ke cloud storage)
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData({ ...formData, image_url: imageUrl });
    }
  };

  // Handle size price change
  const handleSizePriceChange = (index, value) => {
    const newSizes = [...sizes];
    newSizes[index].price = parseFloat(value) || 0;
    setSizes(newSizes);

    // Convert to size_prices object
    const sizePrices = {};
    newSizes.forEach((item) => {
      sizePrices[item.size] = item.price;
    });
    setFormData({ ...formData, size_prices: sizePrices });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validasi data sebelum dikirim
      if (!formData.name || !formData.base_price) {
        alert("Nama produk dan harga dasar harus diisi");
        return;
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.base_price) || 0,
        description: "",
        image_url: formData.image_url || "",
      };

      let response;
      if (currentProduct) {
        response = await updateProduct(currentProduct.id, productData);
      } else {
        response = await createProduct(productData);
      }

      if (response && response.product) {
        // Update state dengan data terbaru dari server
        if (currentProduct) {
          setProducts(
            products.map((p) =>
              p.id === currentProduct.id ? response.product : p
            )
          );
        } else {
          setProducts([...products, response.product]);
        }

        // Reset form
        setIsModalOpen(false);
        setFormData({
          name: "",
          base_price: "",
          image_url: "",
          size_prices: {},
        });
        setCurrentProduct(null);
        setImagePreview(null);
        setSizes([
          { size: "S", price: 0 },
          { size: "M", price: 0 },
          { size: "L", price: 0 },
          { size: "XL", price: 0 },
        ]);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.message || "Terjadi kesalahan saat menyimpan produk");
    }
  };

  // Handle edit
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      base_price: product.base_price,
      image_url: product.image_url,
      size_prices: product.size_prices || {},
    });
    setImagePreview(product.image_url);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    if (!product || !product.name) return false;
    const searchTermLower = searchTerm ? searchTerm.toLowerCase() : "";
    const productNameLower = product.name ? product.name.toLowerCase() : "";
    return productNameLower.includes(searchTermLower);
  });

  return (
    <div className="space-y-6">
      {/* Header dan Tombol Tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manajemen Produk</h2>
          <p className="text-gray-500 mt-1">Kelola produk dan stok toko Anda</p>
        </div>
        <button
          onClick={() => {
            setCurrentProduct(null);
            setFormData({
              name: "",
              base_price: "",
              image_url: "",
              size_prices: {},
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus className="text-lg" />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
            <input
              type="text"
              placeholder="Cari produk..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product List */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat produk...</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? "Produk tidak ditemukan" : "Belum ada produk"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl transform transition-all duration-300 scale-100">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-black">
                {currentProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Kolom Kiri */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Produk*
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black placeholder-gray-400"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Harga Dasar*
                      </label>
                      <input
                        type="number"
                        name="base_price"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black placeholder-gray-400"
                        value={formData.base_price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            base_price: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Gambar
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="cursor-pointer flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
                          <FiUpload />
                          <span>Pilih File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-12 w-12 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Kolom Kanan - Size dan Harga */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga per Ukuran
                    </label>
                    <div className="space-y-3">
                      {sizes.map((size, index) => (
                        <div
                          key={size.size}
                          className="flex items-center gap-3"
                        >
                          <span className="w-8 font-medium">{size.size}</span>
                          <input
                            type="number"
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black placeholder-gray-400"
                            placeholder="Harga tambahan"
                            value={size.price}
                            onChange={(e) =>
                              handleSizePriceChange(index, e.target.value)
                            }
                          />
                          <span className="text-gray-500">
                            Total: Rp
                            {(
                              parseFloat(formData.base_price || 0) +
                              parseFloat(size.price || 0)
                            ).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
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

// Komponen ProductItem yang diperbarui
function ProductItem({ product, onEdit, onDelete }) {
  const [selectedSize, setSelectedSize] = useState("S");
  const [showImagePopup, setShowImagePopup] = useState(false);

  const getTotalPrice = (size) => {
    const basePrice = parseFloat(product.base_price) || 0;
    const sizePrice = parseFloat(product.size_prices?.[size] || 0);
    return basePrice + sizePrice;
  };

  return (
    <>
      <div className="p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4">
          {product.image_url ? (
            <div
              className="w-16 h-16 cursor-pointer"
              onClick={() => setShowImagePopup(true)}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <FiBox className="text-gray-400 text-xl" />
            </div>
          )}

          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                {Object.keys(product.size_prices || {}).map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600">
                Harga: Rp{getTotalPrice(selectedSize).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FiEdit2 />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>

      {/* Image Popup */}
      {showImagePopup && product.image_url && (
        <div
          className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImagePopup(false)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowImagePopup(false)}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition-colors bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            >
              <FiX size={24} />
            </button>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
