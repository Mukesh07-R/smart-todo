import React, { useMemo } from "react";
import { formatDistanceToNow, isBefore, parseISO } from "date-fns";
import { HiTrash, HiCheck, HiRefresh, HiPencil } from "react-icons/hi";

export default function TaskCard({ task, onToggleComplete, onDelete, onEdit }) {
  const deadlineDate = task.deadline ? parseISO(task.deadline) : null;
  const now = new Date();

  const status = useMemo(() => {
    if (task.isCompleted) return "success";
    if (deadlineDate && isBefore(deadlineDate, now)) return "failure";
    return "ongoing";
  }, [task, deadlineDate, now]);

  const timeText = useMemo(() => {
    if (!deadlineDate) return "No deadline";
    if (task.isCompleted)
      return `Completed • ${formatDistanceToNow(deadlineDate, { addSuffix: true })}`;
    const diffText = formatDistanceToNow(deadlineDate, { addSuffix: true });
    return diffText.startsWith("in ")
      ? `Due ${diffText.replace(/^in /, "")}`
      : `Overdue ${diffText.replace(/ ago$/, "")}`;
  }, [deadlineDate, task]);

  return (
    <div
      className="  bg-white border rounded-md
        p-2 sm:p-3 md:p-4            /* smaller padding on small screens, larger on bigger */
        shadow-sm                    /* subtle shadow */
        hover:shadow-md transition-shadow duration-150
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
      "
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-semibold ${task.isCompleted ? "line-through text-gray-400" : ""}`}>
            {task.title}
          </h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              status === "success"
                ? "bg-green-100 text-green-700"
                : status === "failure"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
            aria-hidden
          >
            {status.toUpperCase()}
          </span>
        </div>

        {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
        <p className="text-xs text-gray-500 mt-2">{timeText}</p>
      </div>

      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <button
          onClick={() => onToggleComplete(task)}
          title={task.isCompleted ? "Mark incomplete" : "Mark complete"}
          aria-label={task.isCompleted ? "Mark incomplete" : "Mark complete"}
          className="p-2 border rounded hover:bg-gray-50"
        >
          {task.isCompleted ? <HiRefresh /> : <HiCheck />}
        </button>

        <button
          onClick={() => onEdit(task)}
          title="Edit task"
          aria-label="Edit task"
          className="p-2 border rounded hover:bg-gray-50"
        >
          <HiPencil />
        </button>

        <button
          onClick={() => onDelete(task)}
          title="Delete task"
          aria-label="Delete task"
          className="p-2 border rounded hover:bg-gray-50 text-red-600"
        >
          <HiTrash />
        </button>
      </div>
    </div>
  );
}