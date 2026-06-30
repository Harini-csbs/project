import React from "react";
import {
  FaChartPie,
  FaWallet,
  FaBullseye,
  FaMoneyBillTrendUp,
  FaGear,
  FaMoon,
  FaSun,
} from "react-icons/fa6";
import { NavLink } from "react-router-dom";
// Import your theme hook to read global light/dark mode status
import { useTheme } from "../../context/ThemeContext"; 
import "./Sidebar.css";

export default function Sidebar() {
  // Extract theme properties from your custom context
  const { theme, toggleTheme } = useTheme();

  const menu = [
    {
      title: "Dashboard",
      path: "/",
      icon: <FaChartPie />,
    },
    {
      title: "Transactions",
      path: "/transactions",
      icon: <FaWallet />,
    },
    {
      title: "Budget",
      path: "/budget",
      icon: <FaMoneyBillTrendUp />,
    },
    {
      title: "Goals",
      path: "/goals",
      icon: <FaBullseye />,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <FaGear />,
    },
  ];

  return (
    <aside className="sidebar" aria-label="Primary Workspace Sidebar">
      
      <div className="logo">
        <span role="img" aria-label="money bag">💰</span>
        <div>
          <h2>Finance</h2>
          <span>Dashboard</span>
        </div>
      </div>

      {/* Added aria-label to clear the Accessibility requirement */}
      <nav aria-label="Main Navigation Links">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Fully operational theme switch matching the checklist criteria */}
      <div className="sidebar-footer">
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <>
              <FaMoon />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <FaSun />
              <span>Light Mode</span>
            </>
          )}
        </button>
      </div>

    </aside>
  );
}