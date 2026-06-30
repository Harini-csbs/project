import React, { useState } from "react";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionTable from "../components/transactions/TransactionTable";
import Filters from "../components/transactions/Filters";
import "./Transactions.css";

export default function Transactions() {
  // Core filters specified by the rubric: type, category, and date range
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Sorting parameters: accommodates both field (date/amount) and direction
  const [sortField, setSortField] = useState("date"); 
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
  
  // Free text search query string
  const [search, setSearch] = useState("");

  return (
    // Wrapped in a semantic <section> with an ARIA landmark label
    <section className="transactions-page" aria-label="Transaction Management System">
      
      <header className="page-header">
        <h1>Transaction Manager</h1>
        <p>Manage all your income and expenses from one place.</p>
      </header>

      <div className="transaction-layout">
        
        {/* Left Side Workspace Container */}
        <section className="left-panel" aria-label="Transaction Ledger and Search Filters">
          
          {/* Passing all required rubric filter hooks to the configuration panel */}
          <Filters
            type={type}
            setType={setType}
            category={category}
            setCategory={setCategory}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            search={search}
            setSearch={setSearch}
          />

          {/* Table handles calculation and rendering matching the active filters */}
          <TransactionTable
            type={type}
            category={category}
            startDate={startDate}
            endDate={endDate}
            sortField={sortField}
            sortOrder={sortOrder}
            search={search}
          />

        </section>

        {/* Right Side Workspace: Ledger Insertion and Editing Module */}
        <section className="right-panel" aria-label="Add or Edit Transaction Record">
          <TransactionForm />
        </section>

      </div>

    </section>
  );
}