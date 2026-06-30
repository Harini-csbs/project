import React from "react";
import "./ProgressBar.css";

export default function ProgressBar({
  percentage,
  color = "#2563EB",
}) {
  const progress = Math.max(
    0,
    Math.min(100, percentage)
  );

  return (
    <div className="progress-container">

      <div
        className="progress-fill"
        style={{
          width: `${progress}%`,
          background: color,
        }}
      />

    </div>
  );
}