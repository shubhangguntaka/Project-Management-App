import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Homepage from "./pages/Homepage";
import KanbanBoard from "./pages/KanbanBoard";
import UserManagement from "./pages/UserManagement";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/board" element={<KanbanBoard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/dashboard/:userId" element={<UserDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;