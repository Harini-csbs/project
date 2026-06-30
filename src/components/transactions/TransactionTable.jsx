import React, { useMemo } from "react";
import { useFinance } from "../../context/FinanceContext";
import {
  FaTrash,
  FaPen,
  FaArrowTrendUp,
  FaArrowTrendDown,
} from "react-icons/fa6";


export default function TransactionTable({
  type,
  sort,
  search,
}) {
  const {
    transactions,
    deleteTransaction,
    formatValue,
  } = useFinance();

  const data = useMemo(() => {
    let filtered =
      type === "all"
        ? [...transactions]
        : transactions.filter((t) => t.type === type);

    // Search by title or category
    filtered = filtered.filter((t) => {
      const keyword = search.toLowerCase();

      return (
        t.title.toLowerCase().includes(keyword) ||
        t.category.toLowerCase().includes(keyword)
      );
    });

    // Sort
    filtered.sort((a, b) => {
      if (sort === "amount") {
        return Number(b.amount) - Number(a.amount);
      }

      return new Date(b.date) - new Date(a.date);
    });

    return filtered;
  }, [transactions, type, sort, search]);

  return (
    <div className="table-card">
      <div className="table-header">
        <h2>Transactions</h2>

        <span>{data.length} Records</span>
      </div>

      {data.length === 0 ? (
        <div className="empty-table">
          No transactions found.
        </div>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((t) => (
              <tr key={t.id}>
                <td>{t.title}</td>

                <td>
                  <span className="badge">
                    {t.category}
                  </span>
                </td>

                <td>
                  {new Date(t.date).toLocaleDateString()}
                </td>

                <td>
                  <span
                    className={
                      t.type === "income"
                        ? "income-type"
                        : "expense-type"
                    }
                  >
                    {t.type === "income" ? (
                      <FaArrowTrendUp />
                    ) : (
                      <FaArrowTrendDown />
                    )}

                    {t.type.charAt(0).toUpperCase() +
                      t.type.slice(1)}
                  </span>
                </td>

                <td className="amount">
                  {formatValue(Number(t.amount))}
                </td>

                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    title="Edit feature coming next"
                  >
                    <FaPen />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTransaction(t.id)}
                    title="Delete Transaction"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}