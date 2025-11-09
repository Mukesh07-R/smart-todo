import React, { useState, useEffect, useRef } from "react";

function isoToDatetimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function TaskForm({ onSubmit, initial = null, submitLabel = "Create Task", onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [deadline, setDeadline] = useState(() => isoToDatetimeLocal(initial?.deadline));

  // ref to title input so we can focus when appropriate
  const titleRef = useRef(null);

  // Apply initial when its id changes. If initial becomes null -> reset (create mode).
  useEffect(() => {
    if (!initial) {
      setTitle("");
      setDescription("");
      setDeadline("");
      // focus title on create mode
      requestAnimationFrame(() => titleRef.current?.focus());
      return;
    }
    setTitle(initial.title ?? "");
    setDescription(initial.description ?? "");
    setDeadline(isoToDatetimeLocal(initial.deadline));
    // focus title when editing as well 
    requestAnimationFrame(() => titleRef.current?.focus());
  }, [initial?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    const payload = {
      title: title.trim(),
      description: description.trim(),
      deadline: deadline ? new Date(deadline).toISOString() : null,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            w-full px-3 py-2 border rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
            transition-shadow
          "
          placeholder="Task title"
          aria-label="Task title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
          placeholder="Optional description"
          rows={3}
          aria-label="Task description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deadline</label>
        <input
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          type="datetime-local"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
          aria-label="Task deadline"
        />
        <p className="text-xs text-gray-500 mt-1">Leave empty for no deadline</p>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}