import React, { useState, useEffect } from "react";

const ROLES = ["Admin", "Developer", "Tester", "Manager"];

export default function UserModal({ user, onSave, onClose }) {
  const isEdit = !!user;

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Developer",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "Developer",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? "Edit User" : "New User"}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} id="user-form">
            {error && (
              <p style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "12px" }}>
                {error}
              </p>
            )}

            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                className="form-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name..."
                required
                id="user-name-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                className="form-input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
                id="user-email-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                name="role"
                value={form.role}
                onChange={handleChange}
                id="user-role-input"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="modal-footer" style={{ padding: 0, borderTop: "none", marginTop: "8px" }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" id="user-save-btn">
                {isEdit ? "Save Changes" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
