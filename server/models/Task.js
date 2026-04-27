const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: {
    type: String,
    enum: ["Backlog", "Todo", "In Progress", "Code Review", "Testing", "Done"],
    default: "Backlog"
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Medium"
  },
  history: [
    {
      status: String,
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      changedAt: { type: Date, default: Date.now },
      note: { type: String, default: "" }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);