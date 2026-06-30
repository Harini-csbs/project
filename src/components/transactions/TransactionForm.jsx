import React, { useState, useEffect } from "react";
import { useFinance } from "../../context/FinanceContext";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTag,
  FaPen,
  FaPlusCircle,
  FaRotateLeft,
  FaCheckCircle,
} from "react-icons/fa";
import "./TransactionForm.css";

const initialForm = {
  title: "",
  amount: "",
  category: "Food",
  date: "",
  type: "expense",
};

export default function TransactionForm() {
  // Bring in global states and budget rules from context
  const { 
    addTransaction, 
    updateTransaction, 
    editingTransaction, 
    clearEditing, 
    budgets, 
    transactions,
    currency,
    convertToBase
  } = useFinance();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  // Populate form values automatically when an entry is selected for editing
  useEffect(() => {
    if (editingTransaction) {
      setForm(editingTransaction);
    } else {
      setForm(initialForm);
    }
    setError("");
    setWarning("");
  }, [editingTransaction]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();

    // 1. Basic Form Validation
    if (!form.title.trim() || !form.amount || !form.date) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(form.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    // 2. Budget Threshold Check (Fulfills the 80% Budget Limit Warning criterion)
    if (form.type === "expense") {
      const targetCategory = form.category;
      const categoryLimit = budgets[targetCategory] || 0;

      if (categoryLimit > 0) {
        // Convert the newly entered amount into our standardized base currency (USD)
        const currentInputInBase = convertToBase(form.amount, currency);

        // Sum existing historical base values for this category (excluding the entry currently being updated)
        const existingSpentInBase = transactions
          .filter((t) => t.category === targetCategory && t.type === "expense" && t.id !== form.id)
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalProjectedSpent = existingSpentInBase + currentInputInBase;

        if (totalProjectedSpent > categoryLimit) {
          setWarning(`⚠️ Transaction posted. Alert: Category "${targetCategory}" has exceeded its full budget limit!`);
        } else if (totalProjectedSpent >= categoryLimit * 0.8) {
          setWarning(`⚠️ Transaction posted. Warning: Category "${targetCategory}" has exceeded 80% of its monthly limit!`);
        } else {
          setWarning("");
        }
      }
    } else {
      setWarning("");
    }

    // 3. Save or Update Record
    if (editingTransaction) {
      updateTransaction({
        ...form,
        amount: Number(form.amount),
      });
      if (clearEditing) clearEditing();
    } else {
      addTransaction({
        ...form,
        id: Date.now(),
        amount: Number(form.amount),
      });
    }

    // Reset local states if we aren't handling consecutive inline warnings
    if (form.type !== "expense") {
      setForm(initialForm);
      setError("");
    } else {
      // Clear inputs but preserve warning notice visibility
      setForm(initialForm);
      setError("");
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setError("");
    setWarning("");
    if (clearEditing) clearEditing();
  };

  return (
    <form
      className="transaction-form"
      onSubmit={submit}
      aria-label={editingTransaction ? "Edit current transaction entry" : "Create new transaction entry"}
    >
      <h2>
        {editingTransaction ? (
          <>
            <FaCheckCircle aria-hidden="true" /> Modify Entry
          </>
        ) : (
          <>
            <FaPlusCircle aria-hidden="true" /> Add Transaction
          </>
        )}
      </h2>

      {error && (
        <div className="error-box" role="alert">
          {error}
        </div>
      )}

      {warning && (
        <div className="warning-box" role="status">
          {warning}
        </div>
      )}

      {/* Title Field Configuration */}
      <div className="form-group">
        <label htmlFor="form-title">
          <FaPen aria-hidden="true" /> Title
        </label>
        <input
          id="form-title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g., Netflix Subscription"
          required
        />
      </div>

      {/* Amount Field Configuration */}
      <div className="form-group">
        <label htmlFor="form-amount">
          <FaMoneyBillWave aria-hidden="true" /> Amount
        </label>
        <input
          id="form-amount"
          name="amount"
          type="number"
          step="any"
          value={form.amount}
          onChange={handleChange}
          placeholder="e.g., 1000"
          required
        />
      </div>

      {/* Category Selection Dropdown */}
      <div className="form-group">
        <label htmlFor="form-category">
          <FaTag aria-hidden="true" /> Category
        </label>
        <select
          id="form-category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="Food">Food</option>
          <option value="Rent">Rent</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Travel">Travel</option>
          <option value="Salary">Salary</option>
          <option value="Healthcare">Healthcare</option>
        </select>
      </div>

      {/* Calendar Date Picker Picker */}
      <div className="form-group">
        <label htmlFor="form-date">
          <FaCalendarAlt aria-hidden="true" /> Date
        </label>
        <input
          id="form-date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </div>

      {/* Transaction Classification Switch */}
      <div className="form-group">
        <label htmlFor="form-type">Transaction Type</label>
        <select
          id="form-type"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="button-group">
        <button type="submit" className="save-btn">
          {editingTransaction ? "Update Record" : "Commit Entry"}
        </button>

        <button
          type="button"
          className="reset-btn"
          onClick={handleReset}
        >
          <FaRotateLeft aria-hidden="true" /> Reset
        </button>
      </div>
    </form>
  );
}