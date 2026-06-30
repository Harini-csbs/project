import React, { createContext, useContext, useState, useEffect } from "react";

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  // Persistence Layer
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "USD");
  const [rates, setRates] = useState({ USD: 1, INR: 83, EUR: 0.92 });
  
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem("txs")) || [
    { id: 1, title: "Salary Drop", amount: 5000, category: "Salary", date: "2026-06-01", type: "income" },
    { id: 2, title: "Groceries", amount: 450, category: "Food", date: "2026-06-02", type: "expense" }
  ]);

  const [budgets, setBudgets] = useState(() => JSON.parse(localStorage.getItem("budgets")) || {
    Food: 600, Rent: 1500, Utilities: 300, Entertainment: 400, Shopping: 500, Travel: 300, Healthcare: 200
  });

  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem("goals")) || [
    { id: 1, name: "Europe Summer Trip", target: 4000, current: 1200, deadline: "2026-12-31" }
  ]);

  const [editingTx, setEditingTx] = useState(null);

  // Sync structural updates with DOM attributes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem("currency", currency); }, [currency]);
  useEffect(() => { localStorage.setItem("txs", JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem("budgets", JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem("goals", JSON.stringify(goals)); }, [goals]);

  // Dynamic Live Network Exchange Fetching
  useEffect(() => {
    fetch(`https://v6.exchangerate-api.com/v6/latest/USD`) 
      .then(res => res.json())
      .then(data => {
        if (data && data.conversion_rates) {
          setRates({
            USD: data.conversion_rates.USD || 1,
            INR: data.conversion_rates.INR || 83,
            EUR: data.conversion_rates.EUR || 0.92
          });
        }
      })
      .catch(() => console.log("Using backup baseline conversions currency definitions safely."));
  }, []);

  // Utility Converters
  const formatValue = (amountInUSD) => {
    const converted = amountInUSD * (rates[currency] || 1);
    const symbols = { USD: "$", INR: "₹", EUR: "€" };
    return `${symbols[currency] || "$"}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const convertToBase = (value, standard) => Number(value) / (rates[standard] || 1);

  // Business Action Dispatches
  const addTransaction = (tx) => setTransactions([tx, ...transactions]);
  const deleteTransaction = (id) => setTransactions(transactions.filter(t => t.id !== id));
  const updateTransaction = (updated) => {
    setTransactions(transactions.map(t => t.id === updated.id ? updated : t));
    setEditingTx(null);
  };
  const updateBudget = (cat, lim) => setBudgets({ ...budgets, [cat]: lim });
  const addGoal = (g) => setGoals([...goals, g]);
  const deleteGoal = (id) => setGoals(goals.filter(g => g.id !== id));
  
  const contributeToGoal = (id, amt) => {
    setGoals(goals.map(g => g.id === id ? { ...g, current: Math.min(g.target, g.current + Number(amt)) } : g));
  };

  return (
    <FinanceContext.Provider value={{
      theme, setTheme, currency, setCurrency, transactions, budgets, goals, editingTx, setEditingTx,
      formatValue, convertToBase, addTransaction, deleteTransaction, updateTransaction, updateBudget, addGoal, deleteGoal, contributeToGoal
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);