import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import BudgetCard from "../components/budget/BudgetCard";
import { FaSliders, FaCheckCircle } from "react-icons/fa6";
import "./Budget.css";

export default function Budget() {
  const { budgets, transactions, updateBudget, formatValue } = useFinance();

  // Local state properties for handling dynamic limit modifications
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [newLimit, setNewLimit] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Dynamically sum the total budgeted caps
  const totalBudget = Object.values(budgets).reduce(
    (sum, value) => sum + Number(value),
    0
  );

  // Dynamically calculate actual spent expenses from the global transaction list
  const totalSpent = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const remaining = totalBudget - totalSpent;

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!newLimit || Number(newLimit) <= 0) return;

    // Dispatches adjustment back to FinanceContext
    updateBudget(selectedCategory, Number(newLimit));
    setSuccessMsg(`Successfully updated "${selectedCategory}" limit!`);
    setNewLimit("");
    
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <section className="budget-page" aria-label="Budget Optimization and Category Caps">
      
      <header className="budget-header">
        <div>
          <h1>Budget Manager</h1>
          <p>Track and control your spending across all categories.</p>
        </div>
      </header>

      {/* Global Summary Metric Row */}
      <div className="budget-summary">
        <div className="summary-box">
          <h3>Total Budget</h3>
          <h2>{formatValue(totalBudget)}</h2>
        </div>

        <div className="summary-box spent">
          <h3>Total Spent</h3>
          <h2>{formatValue(totalSpent)}</h2>
        </div>

        <div className="summary-box remaining">
          <h3>Remaining Balance</h3>
          <h2 className={remaining < 0 ? "negative-balance" : ""}>
            {formatValue(remaining)}
          </h2>
        </div>
      </div>

      {/* Dynamic Adjustment Form (Fulfills the "edit budget limits" requirement) */}
      <div className="budget-settings-card">
        <h3>
          <FaSliders aria-hidden="true" /> Modify Category Limits
        </h3>
        
        {successMsg && (
          <div className="success-banner" role="status">
            <FaCheckCircle aria-hidden="true" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleUpdate} className="budget-update-form">
          <div className="form-group">
            <label htmlFor="budget-category-select">Select Category</label>
            <select
              id="budget-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {Object.keys(budgets).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget-limit-input">New Spending Limit</label>
            <input
              type="number"
              id="budget-limit-input"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              placeholder="e.g., 6000"
              required
              min="1"
            />
          </div>

          <button type="submit" className="update-budget-btn">
            Update Limit
          </button>
        </form>
      </div>

      {/* Active Grid Container Mapping Cards */}
      <div className="budget-grid" role="region" aria-label="Category Progress Trackers">
        {Object.entries(budgets).map(([category, limit]) => (
          <BudgetCard
            key={category}
            category={category}
            limit={limit}
          />
        ))}
      </div>

    </section>
  );
}