import { useState, useEffect } from "react";

export default function ReportsTab() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch data
    const fetchReports = async () => {
      try {
        // Ini contoh data dummy, nanti diganti dengan API call
        const dummyReports = [
          {
            id: 1,
            title: "Laporan Penjualan Harian",
            date: new Date().toISOString(),
            total: 1500000,
          },
          {
            id: 2,
            title: "Laporan Stok Produk",
            date: new Date().toISOString(),
            total: 45,
          },
        ];
        setReports(dummyReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Memuat laporan...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Laporan</h2>
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="border rounded-lg p-4">
            <h3 className="font-medium text-lg">{report.title}</h3>
            <p className="text-gray-600">
              Tanggal: {new Date(report.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              Total:{" "}
              {typeof report.total === "number"
                ? `Rp${report.total.toLocaleString()}`
                : report.total}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
