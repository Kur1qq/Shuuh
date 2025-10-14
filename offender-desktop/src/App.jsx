import React from "react";
import DashboardLayout from "./components/DashboardLayot";
import OffenderForm from "./pages/Form";
import List from "./pages/List";

export default function App() {
  return (
    <DashboardLayout>
      {(active) => (active === "form" ? <OffenderForm /> : <List />)}
    </DashboardLayout>
  );
}
