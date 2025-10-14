import React, { useEffect, useState } from "react";

export default function OffenderList() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/offenders")
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleDownloadPDF = (id) => {
    window.open(`http://localhost:4000/api/offenders/${id}/pdf`, "_blank");
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        📋 Бүртгэгдсэн ялтнуудын жагсаалт
      </h2>

      <table className="w-full border-collapse text-sm shadow">
        <thead className="bg-gray-100 border-b">
          <tr className="text-left">
            <th className="border p-2">ID</th>
            <th className="border p-2">Овог нэр</th>
            <th className="border p-2">Регистр</th>
            <th className="border p-2 text-center">Хэвлэх</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border p-2 text-center">{r.id}</td>
                <td className="border p-2">{r.surname} {r.given_name}</td>
                <td className="border p-2">{r.register_no}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDownloadPDF(r.id)}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1 rounded-md"
                  >
                    🖨 Хэвлэх
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" className="text-center p-4 text-gray-500">Мэдээлэл алга байна</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
