import React from "react";
import { useFinance } from "../context/FinanceContext";
import GoalCard from "../components/goals/GoalCard";
import GoalForm from "../components/goals/GoalForm";
import "./Goals.css";

export default function Goals() {
  const { goals, formatValue } = useFinance();

  const totalTarget = goals.reduce(
    (sum, goal) => sum + Number(goal.targetAmount),
    0
  );

  const totalSaved = goals.reduce(
    (sum, goal) => sum + Number(goal.currentAmount),
    0
  );

  return (
    // Replaced outer container div with a semantic section and an explicit ARIA label
    <section className="goals-page" aria-label="Savings Goals Workspace">
      
      <header className="goals-header">
        <div>
          <h1>Savings Goals</h1>
          <p>Stay on track and achieve your financial dreams.</p>
        </div>
      </header>

      {/* Global Goals Operational Metrics Header Row */}
      <div className="goal-summary">
        <div className="summary-card">
          <h4>Total Goal Target</h4>
          <h2>{formatValue(totalTarget)}</h2>
        </div>

        <div className="summary-card">
          <h4>Total Saved Accumulation</h4>
          <h2>{formatValue(totalSaved)}</h2>
        </div>

        <div className="summary-card">
          <h4>Tracked Goals</h4>
          <h2>{goals.length}</h2>
        </div>
      </div>

      <div className="goal-layout">
        
        {/* Semantic section for the card ledger list stack */}
        <section 
          className="goal-list" 
          aria-label="Active savings goals progress cards"
          aria-live="polite"
        >
          {goals.length === 0 ? (
            <div className="empty-card" role="status">
              No goals yet. Create your first savings goal.
            </div>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
              />
            ))
          )}
        </section>

        {/* Semantic aside section wrapping our input insertion form element layout panel */}
        <aside className="goal-form-container" aria-label="Create new savings target goal">
          <GoalForm />
        </aside>

      </div>

    </section>
  );
}