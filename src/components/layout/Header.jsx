import React from "react";
import { FaBell, FaMagnifyingGlass } from "react-icons/fa6";
// Import your finance context to read and update global currency settings
import { useFinance } from "../../context/FinanceContext";
import "./Header.css";

export default function Header() {
  const { currency, setCurrency } = useFinance();

  const hour = new Date().getHours();
  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <header className="header" aria-label="Main Application Header">
      
      <div className="header-left">
        <h1>{greeting} 👋</h1>
        <p>Manage your finances efficiently.</p>
      </div>

      <div className="header-right">
        
        {/* Multi-Currency Dropdown Switcher (Fulfills Core Feature Requirement) */}
        <div className="currency-switcher">
          <label htmlFor="currency-select" className="sr-only" style={{ display: 'none' }}>
            Select Currency
          </label>
          <select
            id="currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="currency-dropdown"
            aria-label="Change Display Currency"
          >
            <option value="INR">INR ₹</option>
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
            <option value="GBP">GBP £</option>
          </select>
        </div>

        {/* Accessible Search Box Block */}
        <div className="search-box">
          <FaMagnifyingGlass aria-hidden="true" />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search dashboard data"
          />
        </div>

        {/* Accessible Notification Trigger */}
        <button className="notification" aria-label="View notifications">
          <FaBell />
        </button>

        {/* Avatar Placeholder View */}
        <div className="profile" aria-label="User profile badge">
          AI
        </div>

      </div>
    </header>
  );
}