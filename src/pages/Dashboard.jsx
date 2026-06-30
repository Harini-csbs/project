import React from "react";
import DashboardHero from "../components/dashboard/DashboardHero";
import SummaryCards from "../components/dashboard/SummaryCards";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart";
import ExpensePieChart from "../components/dashboard/ExpensePieChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import QuickActions from "../components/dashboard/QuickActions";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import SavingsGoals from "../components/dashboard/SavingsGoals";

import "./Dashboard.css";

export default function Dashboard() {
  return (
    // Replaced outer wrapper with a semantic section with an explicit ARIA label
    <section className="dashboard" aria-label="Financial Overview Dashboard">

      <DashboardHero />

      <SummaryCards />

      <div className="dashboard-grid">

        {/* Using semantic structural sections for accessible column layouts */}
        <section className="dashboard-left" aria-label="Transaction Trends and Ledger">
          <IncomeExpenseChart />
          <RecentTransactions />
        </section>

        <section className="dashboard-right" aria-label="Budgets and Financial Goals Targets">
          <ExpensePieChart />
          <BudgetProgress />
          <SavingsGoals />
        </section>

      </div>

      <QuickActions />

    </section>
  );
}