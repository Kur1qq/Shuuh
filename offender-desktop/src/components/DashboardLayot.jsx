import React, { useState } from "react";
import { FileText, Receipt, Menu, LogOut, LayoutDashboard } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [active, setActive] = useState("form");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F7F8FA] text-gray-800">
      {/* --- Sidebar --- */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-60"
        } bg-[#1C1F24] text-gray-200 flex flex-col transition-all duration-300 shadow-md`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#2B2E34]">
          <div className="flex items-center gap-3">
            <div className="bg-[#2B2E34] p-2 rounded-lg">
              <LayoutDashboard size={18} className="text-gray-300" />
            </div>
            {!collapsed && (
              <h1 className="text-[15px] font-medium tracking-wide text-gray-100">
                Ялтны бүртгэл
              </h1>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-gray-100 transition"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <SidebarButton
            active={active === "form"}
            onClick={() => setActive("form")}
            icon={<FileText size={18} />}
            label="Шинэ бүртгэл"
            collapsed={collapsed}
          />
          <SidebarButton
            active={active === "list"}
            onClick={() => setActive("list")}
            icon={<Receipt size={18} />}
            label="Бүртгэлийн жагсаалт"
            collapsed={collapsed}
          />
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-[#2B2E34]">
          <button className="flex items-center gap-3 w-full text-gray-400 hover:text-red-400 transition-colors duration-200">
            <LogOut size={17} />
            {!collapsed && <span className="text-sm">Гарах</span>}
          </button>
        </div>
      </aside>

      {/* --- Main content --- */}
      <main className="flex-1 bg-[#F9FAFB] p-8 overflow-y-auto">
        <header className="mb-6 border-b border-gray-200 pb-3">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {active === "form" ? "🧾 Ялтны бүртгэл нэмэх" : "📋 Бүртгэлийн жагсаалт"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {active === "form"
              ? "Ялтны мэдээллийг системд оруулах хэсэг"
              : "Бүртгэгдсэн ялтнуудын мэдээлэл"}
          </p>
        </header>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          {children(active)}
        </div>
      </main>
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick, collapsed }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200
        ${
          active
            ? "bg-[#2B2E34] text-white"
            : "text-gray-400 hover:text-gray-100 hover:bg-[#25292F]"
        }`}
    >
      <div
        className={`${
          active ? "text-gray-200" : "text-gray-400 group-hover:text-gray-100"
        }`}
      >
        {icon}
      </div>
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
