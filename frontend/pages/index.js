import { useState } from "react";
import { useRouter } from "next/router";
import LoginLayout from "@/components/LoginLayout";
import { setAuthToken } from "@/utils/auth";

export default function Home() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Tambahkan timeout untuk fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal login");
      }

      const data = await response.json();

      if (data.token) {
        // Simpan token
        setAuthToken(data.token);
        console.log("Token saved:", data.token);

        // Redirect ke halaman admin
        router.push("/admin");
      } else {
        throw new Error("Token tidak diterima dari server");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.name === "AbortError") {
        setError(
          "Koneksi ke server timeout. Pastikan server berjalan di port 3001"
        );
      } else if (err.message.includes("Failed to fetch")) {
        setError(
          "Tidak dapat terhubung ke server. Pastikan server berjalan di port 3001"
        );
      } else {
        setError(err.message || "Terjadi kesalahan saat login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <LoginLayout title="Login">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">
            Login Admin
          </h1>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            <div className="mb-6">
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

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Masuk..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-blue-600 hover:underline"
            >
              Daftar disini
            </button>
          </p>
        </div>
      </div>
    </LoginLayout>
  );
}
