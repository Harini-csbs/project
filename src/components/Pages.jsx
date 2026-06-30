import React, { useState, useMemo } from "react";
import { useFinance } from "../context/FinanceContext";
import { FaTrash, FaPen, FaArrowUp, FaArrowDown, FaMoon, FaSun } from "react-icons/fa";

// ==================== VIEW 1: DASHBOARD OVERVIEW ====================
export function DashboardView() {
  const { transactions, budgets, formatValue } = useFinance();

  const metrics = useMemo(() => {
    const inc = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { inc, exp, net: inc - exp };
  }, [transactions]);

  // Aggregate Category Expense Metrics for our Pseudo-Chart Metrics
  const summaryByCategory = useMemo(() => {
    const categories = ["Food", "Rent", "Utilities", "Entertainment", "Shopping", "Travel", "Healthcare"];
    return categories.map(cat => {
      const spent = transactions.filter(t => t.type === "expense" && t.category === cat).reduce((s, t) => s + t.amount, 0);
      return { cat, spent };
    }).filter(item => item.spent > 0);
  }, [transactions]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="grid-3">
        <div className="card" style={{ borderLeft: "4px solid var(--income)" }}>
          <label>Total Income</label>
          <h2>{formatValue(metrics.inc)}</h2>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--expense)" }}>
          <label>Total Expenses</label>
          <h2>{formatValue(metrics.exp)}</h2>
        </div>
        <div className="card" style={{ borderLeft: "4px solid #3b82f6" }}>
          <label>Net Savings</label>
          <h2>{formatValue(metrics.net)}</h2>
        </div>
      </div>

      <div className="card">
        <h3>Expense Distribution by Category Breakdown</h3>
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {summaryByCategory.length === 0 ? <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No expense tracking records available yet.</p> : 
            summaryByCategory.map(c => (
              <div key={c.cat}>
                <div style={{ display: "flex", justifyContent: "between", fontSize: "13px" }}>
                  <span>{c.cat}</span>
                  <span style={{ marginLeft: "auto", fontWeight: "600" }}>{formatValue(c.spent)}</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${Math.min(100, (c.spent / Object.values(budgets).reduce((a,b)=>a+b, 0)) * 100)}%`, backgroundColor: "var(--expense)" }}></div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ==================== VIEW 2: TRANSACTION LEDGER ====================
export function TransactionsView() {
  const { transactions, addTransaction, deleteTransaction, editingTx, setEditingTx, updateTransaction, formatValue, budgets } = useFinance();
  const [fType, setFType] = useState("all");
  const [fCat, setFCat] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({ title: "", amount: "", category: "Food", date: "", type: "expense" });
  const [budgetWarning, setBudgetWarning] = useState("");

  React.useEffect(() => {
    if (editingTx) setForm(editingTx);
    else setForm({ title: "", amount: "", category: "Food", date: "", type: "expense" });
  }, [editingTx]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount || !form.date) return;

    const numAmount = Number(form.amount);
    
    // Proactive 80% Budget Limit Checker Evaluation
    if (form.type === "expense") {
      const cap = budgets[form.category] || 0;
      const currentSpent = transactions.filter(t => t.category === form.category && t.type === "expense" && t.id !== form.id).reduce((s, t) => s + t.amount, 0);
      if (cap > 0 && (currentSpent + numAmount) >= cap * 0.8) {
        setBudgetWarning(`⚠️ Budget Warning: This item causes "${form.category}" to pass 80% of its budget limit!`);
        setTimeout(() => setBudgetWarning(""), 5000);
      }
    }

    if (editingTx) {
      updateTransaction({ ...form, amount: numAmount });
    } else {
      addTransaction({ ...form, id: Date.now(), amount: numAmount });
    }
    setForm({ title: "", amount: "", category: "Food", date: "", type: "expense" });
  };

  const filtered = useMemo(() => {
    return transactions
      .filter(t => fType === "all" || t.type === fType)
      .filter(t => fCat === "all" || t.category === fCat)
      .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => sortField === "amount" ? b.amount - a.amount : new Date(b.date) - new Date(a.date));
  }, [transactions, fType, fCat, sortField, search]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
      <div>
        <form className="card" onSubmit={handleSubmit}>
          <h3>{editingTx ? "Edit Entry" : "Add Entry"}</h3>
          {budgetWarning && <div className="alert-banner">{budgetWarning}</div>}
          <div className="form-group">
            <label htmlFor="tx-title">Title</label>
            <input id="tx-title" type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g., Target Shop" required />
          </div>
          <div className="form-group">
            <label htmlFor="tx-amount">Amount</label>
            <input id="tx-amount" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="Value" required />
          </div>
          <div className="form-group">
            <label htmlFor="tx-cat">Category</label>
            <select id="tx-cat" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {["Food", "Rent", "Utilities", "Entertainment", "Shopping", "Travel", "Healthcare", "Salary"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="tx-date">Date</label>
            <input id="tx-date" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
          </div>
          <div className="form-group">
            <label htmlFor="tx-type">Type</label>
            <select id="tx-type" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "8px" }}>Save Record</button>
        </form>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
          <input type="text" placeholder="Search entries..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search items" />
          <select value={fType} onChange={e => setFType(e.target.value)} aria-label="Filter Type">
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={fCat} onChange={e => setFCat(e.target.value)} aria-label="Filter Category">
            <option value="all">All Categories</option>
            {["Food", "Rent", "Utilities", "Entertainment", "Shopping", "Travel", "Healthcare"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sortField} onChange={e => setSortField(e.target.value)} aria-label="Sort configuration">
            <option value="date">Newest Date</option>
            <option value="amount">Highest Value</option>
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Title</th><th>Category</th><th>Date</th><th>Amount</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td><span style={{ fontSize: "12px", background: "var(--bg-main)", padding: "4px 8px", borderRadius: "4px" }}>{t.category}</span></td>
                  <td>{t.date}</td>
                  <td style={{ color: t.type === "income" ? "var(--income)" : "var(--expense)", fontWeight: "600" }}>
                    {t.type === "income" ? <FaArrowUp style={{fontSize:"10px"}} /> : <FaArrowDown style={{fontSize:"10px"}} />} {formatValue(t.amount)}
                  </td>
                  <td>
                    <button onClick={() => setEditingTx(t)} style={{ background: "none", color: "var(--text-muted)", marginRight: "8px" }} aria-label="Edit item"><FaPen /></button>
                    <button onClick={() => deleteTransaction(t.id)} style={{ background: "none", color: "var(--expense)" }} aria-label="Delete item"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== VIEW 3: BUDGET MANAGEMENT ====================
export function BudgetView() {
  const { budgets, transactions, updateBudget, formatValue } = useFinance();
  const [selectedCat, setSelectedCat] = useState("Food");
  const [newLimit, setNewLimit] = useState("");

  const actuals = useMemo(() => {
    return Object.keys(budgets).reduce((acc, cat) => {
      acc[cat] = transactions.filter(t => t.type === "expense" && t.category === cat).reduce((s, t) => s + t.amount, 0);
      return acc;
    }, {});
  }, [transactions, budgets]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <form className="card" onSubmit={e => { e.preventDefault(); updateBudget(selectedCat, Number(newLimit)); setNewLimit(""); }}>
        <h3>Modify Category Caps</h3>
        <div style={{ display: "flex", gap: "16px", marginTop: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="form-group">
            <label htmlFor="b-cat">Category</label>
            <select id="b-cat" value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
              {Object.keys(budgets).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="b-lim">Spending Limit</label>
            <input id="b-lim" type="number" value={newLimit} onChange={e => setNewLimit(e.target.value)} placeholder="Value" required />
          </div>
          <button type="submit" className="btn-primary" style={{ height: "42px" }}>Update Budget</button>
        </div>
      </form>

      <div className="grid-3">
        {Object.entries(budgets).map(([cat, limit]) => {
          const spent = actuals[cat] || 0;
          const pct = Math.min(100, (spent / limit) * 100);
          return (
            <div className="card" key={cat}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                <span>{cat}</span>
                <span style={{ color: pct >= 100 ? "var(--expense)" : "var(--text-main)" }}>{pct.toFixed(0)}%</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Spent: {formatValue(spent)} of {formatValue(limit)}</p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? "var(--expense)" : pct >= 80 ? "orange" : "var(--primary)" }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== VIEW 4: GOALS PROGRESS ====================
export function GoalsView() {
  const { goals, addGoal, deleteGoal, contributeToGoal, formatValue } = useFinance();
  const [form, setForm] = useState({ name: "", target: "", deadline: "" });
  const [contribs, setContribs] = useState({});

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
      <form className="card" onSubmit={e => { e.preventDefault(); addGoal({ ...form, id: Date.now(), current: 0 }); setForm({ name: "", target: "", deadline: "" }); }}>
        <h3>New Savings Goal</h3>
        <div className="form-group">
          <label htmlFor="g-name">Goal Target Name</label>
          <input id="g-name" type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Tesla / Emergency Fund" required />
        </div>
        <div className="form-group">
          <label htmlFor="g-target">Target Vault Amount</label>
          <input id="g-target" type="number" value={form.target} onChange={e => setForm({...form, target: e.target.value})} required />
        </div>
        <div className="form-group">
          <label htmlFor="g-date">Target Date</label>
          <input id="g-date" type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} required />
        </div>
        <button type="submit" className="btn-primary" style={{ width: "100%" }}>Create Goal</button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {goals.map(g => {
          const pct = Math.min(100, (g.current / g.target) * 100);
          return (
            <div className="card" key={g.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h4>{g.name} {pct >= 100 && <span style={{ color: "var(--income)", fontSize: "12px", fontWeight: "700" }}>✓ ACHIEVED</span>}</h4>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Accumulated: {formatValue(g.current)} / {formatValue(g.target)} (Deadline: {g.deadline})</p>
                <div className="progress-bar-bg" style={{ width: "240px" }}><div className="progress-bar-fill" style={{ width: `${pct}%`, backgroundColor: "var(--income)" }}></div></div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginLeft: "auto" }}>
                <input type="number" style={{ width: "80px", padding: "6px" }} placeholder="Amount" value={contribs[g.id] || ""} onChange={e => setContribs({ ...contribs, [g.id]: e.target.value })} aria-label="Add contribution sum" />
                <button className="btn-primary" onClick={() => { contributeToGoal(g.id, contribs[g.id] || 0); setContribs({ ...contribs, [g.id]: "" }); }} style={{ padding: "8px 12px", fontSize: "13px" }}>Add</button>
                <button onClick={() => deleteGoal(g.id)} style={{ background: "none", color: "var(--expense)" }} aria-label="Delete goal item"><FaTrash /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}