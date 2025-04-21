import { useState } from "react";
import { useRouter } from "next/router";
import LoginLayout from "@/components/LoginLayout";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validasi password
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/");
      } else {
        setError(data.error || "Terjadi kesalahan saat registrasi");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Tidak dapat terhubung ke server. Pastikan server berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout title="Register">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            Daftar Akun Baru
          </h1>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 border rounded"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nomor Telepon</label>
              <input
                type="tel"
                name="phone"
                className="w-full p-2 border rounded"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-2 border rounded"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Konfirmasi Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-2 border rounded"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <button
              onClick={() => router.push("/")}
              className="text-blue-600 hover:underline"
            >
              Login disini
            </button>
          </p>
        </div>
      </div>
    </LoginLayout>
  );
}
