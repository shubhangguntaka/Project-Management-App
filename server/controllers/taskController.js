const Task = require("../models/Task");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority } = req.body;
    const initialStatus = status || "Backlog";

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo || null,
      status: initialStatus,
      priority: priority || "Medium",
      history: [
        {
          status: initialStatus,
          changedBy: assignedTo || null,
          note: "Task created"
        }
      ]
    });

    const populated = await Task.findById(task._id).populate("assignedTo").populate("history.changedBy");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all tasks with optional filters
exports.getAllTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter)
      .populate("assignedTo")
      .populate("history.changedBy")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo")
      .populate("history.changedBy");

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a task (handles status changes with history tracking)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const { title, description, assignedTo, status, priority } = req.body;

    // Track status change in history
    if (status && status !== task.status) {
      task.history.push({
        status,
        changedBy: req.body.changedBy || null,
        note: `Status changed from "${task.status}" to "${status}"`
      });
      task.status = status;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (priority !== undefined) task.priority = priority;

    await task.save();

    const populated = await Task.findById(task._id)
      .populate("assignedTo")
      .populate("history.changedBy");

    res.json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get task history
exports.getTaskHistory = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("history.changedBy")
      .select("history title");

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ title: task.title, history: task.history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
