import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api";
import UserModal from "../components/UserModal";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const res = await userApi.getAll();
      setUsers(res.data);
    } catch (err) {
      console.error("Error:", err);
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingUser) {
        await userApi.update(editingUser._id, formData);
        showToast("User updated successfully");
      } else {
        await userApi.create(formData);
        showToast("User created successfully");
      }
      setShowModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user? Their tasks will be unassigned.")) return;
    try {
      await userApi.delete(userId);
      showToast("User deleted");
      fetchUsers();
    } catch (err) {
      showToast("Failed to delete user", "error");
    }
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div id="user-management-page">
      <div className="page-header">
        <h2>Team Members</h2>
        <p>Manage your project team</p>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingUser(null);
            setShowModal(true);
          }}
          id="create-user-btn"
        >
          ＋ New User
        </button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state" style={{ padding: "60px" }}>
          <span className="empty-icon">👥</span>
          <span className="empty-text">No team members yet. Add your first user!</span>
        </div>
      ) : (
        <div className="user-grid">
          {users.map((user) => (
            <div className="user-card" key={user._id} id={`user-card-${user._id}`}>
              <div className="user-avatar">{getInitials(user.name)}</div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
                <span className="role-badge">{user.role}</span>
              </div>
              <div className="user-actions">
                <button
                  className="btn-icon"
                  title="View Dashboard"
                  onClick={() => navigate(`/dashboard/${user._id}`)}
                >
                  📊
                </button>
                <button
                  className="btn-icon"
                  title="Edit User"
                  onClick={() => {
                    setEditingUser(user);
                    setShowModal(true);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="btn-icon danger"
                  title="Delete User"
                  onClick={() => handleDelete(user._id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === "success" ? "✅" : "❌"} {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
