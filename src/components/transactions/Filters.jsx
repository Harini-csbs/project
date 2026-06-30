import React from "react";
import {
  FaFilter,
  FaArrowDownWideShort,
  FaMagnifyingGlass,
  FaCalendarDays,
  FaFolderOpen
} from "react-icons/fa6";
import "./Filters.css";

export default function Filters({
  type,
  setType,
  category,
  setCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  search,
  setSearch,
}) {
  
  // Available budget categories from your global default state
  const categories = [
    "Food",
    "Rent",
    "Utilities",
    "Entertainment",
    "Shopping",
    "Travel",
    "Healthcare"
  ];

  return (
    <div className="filters-card" role="search" aria-label="Transaction Filters Panel">

      {/* Free Text Search Box */}
      <div className="search-container">
        <FaMagnifyingGlass aria-hidden="true" />
        <input
          type="text"
          id="search-input"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search transactions by text"
        />
      </div>

      <div className="filters-grid">
        
        {/* Transaction Type Filter */}
        <div className="filter-group">
          <label htmlFor="filter-type">
            <FaFilter aria-hidden="true" />
            <span>Type</span>
          </label>
          <select
            id="filter-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Dynamic Category Filter */}
        <div className="filter-group">
          <label htmlFor="filter-category">
            <FaFolderOpen aria-hidden="true" />
            <span>Category</span>
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Start Date Range Picker */}
        <div className="filter-group">
          <label htmlFor="filter-start-date">
            <FaCalendarDays aria-hidden="true" />
            <span>From Date</span>
          </label>
          <input
            type="date"
            id="filter-start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date Range Picker */}
        <div className="filter-group">
          <label htmlFor="filter-end-date">
            <FaCalendarDays aria-hidden="true" />
            <span>To Date</span>
          </label>
          <input
            type="date"
            id="filter-end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Sort Target Field Control */}
        <div className="filter-group">
          <label htmlFor="sort-field">
            <FaArrowDownWideShort aria-hidden="true" />
            <span>Sort By</span>
          </label>
          <select
            id="sort-field"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>

        {/* Sort Order Direction Control */}
        <div className="filter-group">
          <label htmlFor="sort-order">
            <FaArrowDownWideShort aria-hidden="true" />
            <span>Direction</span>
          </label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

      </div>
    </div>
  );
}