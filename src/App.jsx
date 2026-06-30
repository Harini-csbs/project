import React, { useState } from "react";
import { FinanceProvider, useFinance } from "./context/FinanceContext";
import { DashboardView, TransactionsView, BudgetView, GoalsView } from "./components/Pages";
import { FaSun, FaMoon } from "react-icons/fa";

function CoreAppShell() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { theme, setTheme, currency, setCurrency } = useFinance();

  return (
    <div className="app-container">
      <aside role="complementary" aria-label="App Navigation Panel">
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--primary)" }}>WealthFlow</h2>
        
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px" }} aria-label="Primary Tab Router">
          {["dashboard", "transactions", "budget", "goals"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                textAlign: "left",
                backgroundColor: activeTab === tab ? "var(--primary)" : "transparent",
                color: activeTab === tab ? "white" : "var(--text-main)",
                textTransform: "capitalize"
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="form-group">
            <label htmlFor="global-currency">Currency</label>
            <select id="global-currency" value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <button 
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", backgroundColor: "var(--bg-main)", color: "var(--text-main)" }}
          >
            {theme === "light" ? <FaMoon /> : <FaSun />} Toggle Theme
          </button>
        </div>
      </aside>

      <main id="main-content" role="main">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ textTransform: "capitalize", fontSize: "26px", fontWeight: "700" }}>{activeTab} Management</h1>
        </header>

        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "transactions" && <TransactionsView />}
        {activeTab === "budget" && <BudgetView />}
        {activeTab === "goals" && <GoalsView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <CoreAppShell />
    </FinanceProvider>
  );
}