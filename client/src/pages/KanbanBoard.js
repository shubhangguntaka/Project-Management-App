import React, { useEffect, useState, useCallback } from "react";
import { taskApi, userApi } from "../api";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

const STATUSES = ["Backlog", "Todo", "In Progress", "Code Review", "Testing", "Done"];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterUser, setFilterUser] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const params = {};
      if (filterUser) params.assignedTo = filterUser;
      const [taskRes, userRes] = await Promise.all([
        taskApi.getAll(params),
        userApi.getAll(),
      ]);
      setTasks(taskRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error("Error:", err);
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [filterUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskApi.update(taskId, { status: newStatus });
      fetchData();
      showToast(`Task moved to ${newStatus}`);
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingTask) {
        await taskApi.update(editingTask._id, formData);
        showToast("Task updated successfully");
      } else {
        await taskApi.create(formData);
        showToast("Task created successfully");
      }
      setShowModal(false);
      setEditingTask(null);
      fetchData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await taskApi.delete(taskId);
      showToast("Task deleted");
      setShowModal(false);
      setEditingTask(null);
      fetchData();
    } catch (err) {
      showToast("Failed to delete task", "error");
    }
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div id="kanban-board-page">
      <div className="page-header">
        <h2>Kanban Board</h2>
        <p>Visualize tasks across SDLC phases</p>
      </div>

      {/* Toolbar */}
      <div className="board-toolbar">
        <div className="board-filters">
          <select
            className="form-select"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            style={{ minWidth: "180px" }}
            id="board-filter-user"
          >
            <option value="">All Users</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={openCreate} id="create-task-btn">
          ＋ New Task
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="kanban-board">
        {STATUSES.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          return (
            <div className="kanban-column" key={status} id={`column-${status.replace(/\s+/g, "-").toLowerCase()}`}>
              <div className="column-header" data-status={status}>
                <span className="column-title">{status}</span>
                <span className="column-count">{columnTasks.length}</span>
              </div>
              <div className="column-body">
                {columnTasks.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <span className="empty-text">No tasks</span>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={openEdit}
                      onStatusChange={handleStatusChange}
                      statuses={STATUSES}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          users={users}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
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
