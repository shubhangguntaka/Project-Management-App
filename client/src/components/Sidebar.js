import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/",      icon: "🏠", label: "Home" },
  { to: "/board",  icon: "📋", label: "Kanban Board" },
  { to: "/users",  icon: "👥", label: "Users" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <h1>ProjectFlow</h1>
        <span>Project Management</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
            id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-glass)" }}>
        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
          © 2026 ProjectFlow
        </p>
      </div>
    </aside>
  );
}
