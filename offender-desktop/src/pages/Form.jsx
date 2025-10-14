import React, { useState } from "react";

export default function OffenderForm() {
  const [form, setForm] = useState({
    gender: "Эр",
    evaded: 0,
  });
  const [loading, setLoading] = useState(false);

  const [households, setHouseholds] = useState([
    { full_name: "", relation: "", employer: "", address: "", phone: "" },
  ]);
  const [relatives, setRelatives] = useState([
    { full_name: "", address: "", phone: "", occupation: "" },
  ]);
  const [coOffenders, setCoOffenders] = useState([
    { clan_name: "", surname: "", given_name: "", note: "" },
  ]);
  const [damages, setDamages] = useState([
    { total_amount: "", paid_amount: "", note: "" },
  ]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleCheckbox = (e) =>
    setForm({ ...form, [e.target.name]: e.target.checked ? 1 : 0 });

  const addRow = (setter, list, emptyRow) => setter([...list, emptyRow]);
  const removeRow = (setter, list, index) =>
    setter(list.filter((_, i) => i !== index));
  const handleArrayChange = (setter, list, index, field, value) => {
    const updated = [...list];
    updated[index][field] = value;
    setter(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      households: JSON.stringify(households),
      relatives: JSON.stringify(relatives),
      co_offenders: JSON.stringify(coOffenders),
      damages: JSON.stringify(damages),
    };

    try {
      const res = await fetch("http://localhost:4000/api/offenders/full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Серверээс алдаа ирлээ");
      const data = await res.json();

      alert("✅ Бүртгэл амжилттай хадгалагдлаа!");
      if (data.id && confirm("PDF татах уу?")) {
        window.open(
          `http://localhost:4000/api/offenders/${data.id}/pdf`,
          "_blank"
        );
      }

      setForm({ gender: "Эр", evaded: 0 });
      setHouseholds([{ full_name: "", relation: "", employer: "", address: "", phone: "" }]);
      setRelatives([{ full_name: "", address: "", phone: "", occupation: "" }]);
      setCoOffenders([{ clan_name: "", surname: "", given_name: "", note: "" }]);
      setDamages([{ total_amount: "", paid_amount: "", note: "" }]);
    } catch (err) {
      console.error(err);
      alert("⚠️ Алдаа гарлаа! Сервертэй холболтоо шалгана уу.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400";

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow-inner">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🧾 ТОРГОХ ЯЛ ШИЙТГҮҮЛСЭН<br />ЯЛТНЫ ДЭЛГЭРЭНГҮЙ БҮРТГЭЛ (Маягт Т-1)
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ✅ 1. Үндсэн мэдээлэл */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input name="clan_name" required placeholder="1. Ургийн овог" onChange={handleChange} className={inputClass}/>
            <input name="surname" required placeholder="2. Овог" onChange={handleChange} className={inputClass}/>
            <input name="given_name" required placeholder="3. Нэр" onChange={handleChange} className={inputClass}/>
            <input name="register_no" required placeholder="4. Регистрийн дугаар" onChange={handleChange} className={inputClass}/>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <select name="gender" onChange={handleChange} className={inputClass}>
              <option>Эр</option><option>Эм</option><option>Бусад</option>
            </select>
            <input name="main_authority" placeholder="6. Үндсэн захиргаа" onChange={handleChange} className={inputClass}/>
            <input name="birth_date" type="date" onChange={handleChange} className={inputClass}/>
            <input name="ethnicity" placeholder="8. Яс үндэс" onChange={handleChange} className={inputClass}/>
            <input name="social_origin" placeholder="9. Нийгмийн гарал" onChange={handleChange} className={inputClass}/>
            <input name="education" placeholder="10. Боловсрол" onChange={handleChange} className={inputClass}/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="profession" placeholder="11. Мэргэжил" onChange={handleChange} className={inputClass}/>
            <input name="phone" placeholder="12. Утас" onChange={handleChange} className={inputClass}/>
          </div>

          {/* ✅ 2. Оршин суугаа хаяг */}
          <h3 className="font-semibold text-lg text-gray-700 mt-6">🏠 Оршин суух хаяг</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea name="address_previous" placeholder="Өмнө оршин суусан хаяг" onChange={handleChange} className={`${inputClass} h-16`}/>
            <textarea name="address_current" placeholder="Одоо оршин сууж буй хаяг" onChange={handleChange} className={`${inputClass} h-16`}/>
          </div>

          {/* ✅ 3. Ажил эрхлэлт */}
          <h3 className="font-semibold text-lg text-gray-700 mt-6">💼 Ажил эрхлэлт</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea name="work_previous" placeholder="Өмнөх байгууллага / ажил эрхлэлтийн байдал" onChange={handleChange} className={`${inputClass} h-16`}/>
            <textarea name="work_current" placeholder="Одоогийн байгууллага / ажил эрхлэлтийн байдал" onChange={handleChange} className={`${inputClass} h-16`}/>
          </div>

          <textarea name="health_status" placeholder="14. Ял эдлэх үеийн эрүүл мэндийн байдал" onChange={handleChange} className={`${inputClass} h-20`}/>
          <textarea name="household_text" placeholder="15. Ам бүлийн товч мэдээлэл" onChange={handleChange} className={`${inputClass} h-20`}/>

          {/* ✅ 4. Ам бүлийн гишүүд */}
          <DynamicTable
            title="👨‍👩‍👧 15.1 Ам бүлийн гишүүд"
            list={households}
            columns={[
              { key: "full_name", label: "Овог нэр" },
              { key: "relation", label: "Хэн болох" },
              { key: "employer", label: "Ажил эрхэлдэг" },
              { key: "address", label: "Хаяг" },
              { key: "phone", label: "Утас" },
            ]}
            setter={setHouseholds}
            onChange={handleArrayChange}
            onAdd={() => addRow(setHouseholds, households, { full_name: "", relation: "", employer: "", address: "", phone: "" })}
            onRemove={(i) => removeRow(setHouseholds, households, i)}
          />

          {/* ✅ 5. Төрөл төрөгсөд */}
          <DynamicTable
            title="🤝 16. Төрөл төрөгсөд, ойр дотны хүмүүс"
            list={relatives}
            columns={[
              { key: "full_name", label: "Овог нэр" },
              { key: "address", label: "Хаяг" },
              { key: "phone", label: "Утас" },
              { key: "occupation", label: "Эрхэлж буй ажил" },
            ]}
            setter={setRelatives}
            onChange={handleArrayChange}
            onAdd={() => addRow(setRelatives, relatives, { full_name: "", address: "", phone: "", occupation: "" })}
            onRemove={(i) => removeRow(setRelatives, relatives, i)}
          />

          {/* ✅ 6. Хохирол */}
          <DynamicTable
            title="💰 17. Хохирол ба төлбөрийн байдал"
            list={damages}
            columns={[
              { key: "total_amount", label: "Нийт хохирол (₮)" },
              { key: "paid_amount", label: "Төлсөн дүн (₮)" },
              { key: "note", label: "Тайлбар" },
            ]}
            setter={setDamages}
            onChange={handleArrayChange}
            onAdd={() => addRow(setDamages, damages, { total_amount: "", paid_amount: "", note: "" })}
            onRemove={(i) => removeRow(setDamages, damages, i)}
          />

          {/* ✅ 7. Гэмт хэрэг */}
          <h3 className="font-semibold text-lg text-gray-700 mt-6">⚖️ Гэмт хэргийн дэлгэрэнгүй</h3>
          <textarea name="crime_cause" placeholder="18. Гэмт хэрэг үйлдсэн шалтгаан" onChange={handleChange} className={`${inputClass} h-20`}/>
          <textarea name="crime_summary" placeholder="19. Хэргийн товч утга" onChange={handleChange} className={`${inputClass} h-20`}/>
          <input name="previous_sentence" placeholder="20. Урьд ял шийтгэгдэж байсан эсэх (зүйл анги, ялын хэмжээ)" onChange={handleChange} className={inputClass}/>
          <textarea name="main_punishment" placeholder="21. Үндсэн ял" onChange={handleChange} className={`${inputClass} h-20`}/>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="evaded" onChange={handleCheckbox}/>
            <span>22. Ялаас зайлсхийсэн</span>
          </label>

          {/* ✅ 8. Хамтран хэрэг үйлдэгч */}
          <DynamicTable
            title="👥 20. Хамтран хэрэг үйлдэгч"
            list={coOffenders}
            columns={[
              { key: "clan_name", label: "Ургийн овог" },
              { key: "surname", label: "Овог" },
              { key: "given_name", label: "Нэр" },
              { key: "note", label: "Тайлбар" },
            ]}
            setter={setCoOffenders}
            onChange={handleArrayChange}
            onAdd={() => addRow(setCoOffenders, coOffenders, { clan_name: "", surname: "", given_name: "", note: "" })}
            onRemove={(i) => removeRow(setCoOffenders, coOffenders, i)}
          />

          {/* ✅ 9. Шүүхийн шийдвэр */}
          <h3 className="font-semibold text-lg text-gray-700 mt-6">🏛️ 23. Шүүхийн шийдвэр</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input name="court_name" placeholder="Шүүхийн нэр" onChange={handleChange} className={inputClass}/>
            <input name="decision_date" type="date" onChange={handleChange} className={inputClass}/>
            <input name="decision_no" placeholder="Шийдвэрийн дугаар" onChange={handleChange} className={inputClass}/>
          </div>
          <input name="criminal_article" placeholder="Эрүүгийн хуулийн зүйл анги" onChange={handleChange} className={inputClass}/>
          <input name="fine_unit" placeholder="Торгуулийн нэгж (тоо)" onChange={handleChange} className={inputClass}/>
          <input name="fine_amount_mnt" placeholder="Торгууль (₮)" onChange={handleChange} className={inputClass}/>

          {/* ✅ 10. Гадаад төрх, зан төлөв */}
          <h3 className="font-semibold text-lg text-gray-700 mt-6">🧍 24. Гадаад төрх, зан төлөв</h3>
          <textarea name="appearance_note" placeholder="24. Гадаад төрх, зан төлөвийн тэмдэглэл" onChange={handleChange} className={`${inputClass} h-20`}/>

          {/* ✅ 11. Ялын өөрчлөлт */}
          <h3 className="font-semibold text-lg text-gray-700 mt-6">🔄 25. Давж заалдах / Ялын өөрчлөлт</h3>
          <textarea name="sentence_change" placeholder="Өөрчлөлтийн тэмдэглэл" onChange={handleChange} className={`${inputClass} h-20`}/>
          <input name="sentence_type" placeholder="Ялын төрөл зүйл анги" onChange={handleChange} className={inputClass}/>

          {/* ✅ 12. Бүртгэлийн мөчлөг */}
          <h3 className="font-semibold text-lg text-gray-700 mt-6">🗂️ Бүртгэл нээсэн / хаасан мэдээлэл</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input name="opened_date" type="date" placeholder="Нээсэн огноо" onChange={handleChange} className={inputClass}/>
            <input name="closed_date" type="date" placeholder="Хаасан огноо" onChange={handleChange} className={inputClass}/>
            <input name="executor_name" placeholder="Шийдвэр гүйцэтгэгчийн нэр" onChange={handleChange} className={inputClass}/>
          </div>
          <textarea name="record_note" placeholder="Бүртгэлийн нэмэлт тайлбар (заавал биш)" onChange={handleChange} className={`${inputClass} h-16`}/>

          {/* ✅ Submit */}
          <div className="text-center pt-4">
            <button
              disabled={loading}
              type="submit"
              className={`px-6 py-2 rounded shadow text-white text-lg font-semibold ${
                loading ? "bg-gray-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Хадгалж байна..." : "💾 Хадгалах"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DynamicTable({ title, list, columns, onChange, onAdd, onRemove, setter }) {
  const inputClass =
    "border border-gray-300 rounded-md px-2 py-1 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  return (
    <div>
      <h3 className="font-semibold text-lg text-gray-700 mt-6 mb-2">{title}</h3>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="border px-2 py-1 text-left">{col.label}</th>
              ))}
              <th className="border px-2 py-1 text-center">✖</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="border px-1 py-1">
                    <input
                      value={row[col.key]}
                      onChange={(e) =>
                        onChange(setter, list, i, col.key, e.target.value)
                      }
                      className={inputClass}
                    />
                  </td>
                ))}
                <td className="border text-center">
                  {list.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemove(i)}
                      className="text-red-500 font-bold"
                    >
                      ✖
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="text-blue-600 hover:text-blue-800 mt-2 font-medium text-sm"
      >
        + Мөр нэмэх
      </button>
    </div>
  );
}
