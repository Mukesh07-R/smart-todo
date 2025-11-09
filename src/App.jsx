// src/App.jsx
import React from "react";
import TaskList from "./components/TaskList";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto py-8">
        <TaskList />
      </div>
    </div>
  );
}