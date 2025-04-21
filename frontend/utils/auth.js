// Fungsi untuk menyimpan token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

// Fungsi untuk mendapatkan token
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Fungsi untuk logout
export const logout = async () => {
  try {
    const token = getAuthToken();
    if (token) {
      await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    // Hapus token dari localStorage
    setAuthToken(null);
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

// Fungsi untuk mengecek apakah user sudah login
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    // Decode token
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);

    // Cek apakah token belum expired
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};
