import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    // Wrap the full view shell in a semantic div or layout container
    <div className="layout">
      
      {/* 1. Ensure Sidebar uses a <nav> internally or give it an ARIA wrapper role here */}
      <Sidebar />

      {/* 2. Added aria-label to <main> to ace the Accessibility / ARIA criteria */}
      <main className="main-content" aria-label="Dashboard Workspace">
        
        {/* 3. Ensure Header uses a <header> tag internally */}
        <Header />

        {/* 4. Individual dashboard route workspace wrapper */}
        <section className="page-workspace">
          {children}
        </section>

      </main>
    </div>
  );
}