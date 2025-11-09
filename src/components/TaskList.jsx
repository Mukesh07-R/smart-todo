import React, { useEffect, useMemo, useState, useCallback } from "react";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { useTasks } from "../hooks/useTasks";
import toast, { Toaster } from "react-hot-toast";

function deriveStatus(task) {
  const now = new Date();
  try {
    if (task.isCompleted) return "success";
    if (task.deadline && new Date(task.deadline) < now) return "failure";
    return "ongoing";
  } catch {
    return "ongoing";
  }
}

export default function TaskList() {
  // ===== hooks & state =====
  const {
    data: tasksRaw,
    isLoading,
    isError,
    createTask,
    updateTask,
    deleteTask,
    refetch,
  } = useTasks();

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [nowTick, setNowTick] = useState(Date.now());

  // periodic re-render to update time-based statuses
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  // normalize tasks shape safely
  const tasks = useMemo(() => {
    if (Array.isArray(tasksRaw)) return tasksRaw;
    if (!tasksRaw) return [];
    if (Array.isArray(tasksRaw.tasks)) return tasksRaw.tasks;
    if (Array.isArray(tasksRaw.data)) return tasksRaw.data;
    const maybeArray = Object.values(tasksRaw).find((v) => Array.isArray(v));
    if (maybeArray) return maybeArray;
    console.error("Unexpected tasks shape from useTasks():", tasksRaw);
    return [];
  }, [tasksRaw]);

  // categorize tasks into buckets
  const buckets = useMemo(() => {
    const res = { ongoing: [], success: [], failure: [] };
    tasks.forEach((t) => {
      const s = deriveStatus(t);
      res[s].push(t);
    });
    res.ongoing.sort((a, b) => new Date(a.deadline || Infinity) - new Date(b.deadline || Infinity));
    res.success.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    res.failure.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0));
    return res;
  }, [tasks, nowTick]);

  const anyMutating = createTask.isLoading || updateTask.isLoading || deleteTask.isLoading;

  // ===== actions =====
  const handleCreate = useCallback(
    (payload) => {
      createTask.mutate(payload, {
        onSuccess: () => {
          toast.success("Task created");
          setShowForm(false);
        },
        onError: () => toast.error("Create failed"),
      });
    },
    [createTask]
  );

  const handleUpdate = useCallback(
    (id, updates) => {
      updateTask.mutate(
        { id, updates },
        {
          onSuccess: () => toast.success("Updated"),
          onError: () => toast.error("Update failed"),
        }
      );
    },
    [updateTask]
  );

  const handleToggleComplete = useCallback(
    (task) => {
      handleUpdate(task.id, {
        isCompleted: !task.isCompleted,
        updatedAt: new Date().toISOString(),
      });
    },
    [handleUpdate]
  );

  const handleDelete = useCallback(
    (task) => {
      if (!confirm("Delete this task?")) return;
      deleteTask.mutate(task.id, {
        onSuccess: () => toast.success("Deleted"),
        onError: () => toast.error("Delete failed"),
      });
    },
    [deleteTask]
  );

  const handleEditSubmit = useCallback(
    (payload) => {
      if (!editing) return;
      handleUpdate(editing.id, {
        ...payload,
        updatedAt: new Date().toISOString(),
      });
      setEditing(null);
    },
    [editing, handleUpdate]
  );

  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
      toast.success("Tasks refreshed");
    } catch (err) {
      console.error("Refetch failed", err);
      toast.error("Failed to refresh tasks");
    }
  }, [refetch]);

  // ===== conditional rendering =====
  if (isLoading) return <div className="p-4">Loading tasks...</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to load tasks. Try reloading.</div>;

  // ===== main UI =====
  return (
    <div className="p-4">
      <Toaster />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Smart Todo</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm((s) => !s);
          }}
          className="px-3 py-2 bg-blue-600 text-white rounded-md disabled:opacity-60"
          disabled={anyMutating}
          aria-label="Add task"
        >
          {createTask.isLoading ? "Adding..." : showForm ? "Close" : "Add Task"}
        </button>
      </div>

      {showForm && !editing && (
        <div className="mb-4 bg-gray-50 p-4 rounded-md shadow-sm">
          <TaskForm
            onSubmit={handleCreate}
            submitLabel="Create Task"
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editing && (
        <div className="mb-4 bg-gray-50 p-4 rounded-md shadow-sm">
          <h3 className="mb-2 font-medium">Edit Task</h3>
          <TaskForm
            initial={editing}
            onSubmit={handleEditSubmit}
            submitLabel={updateTask.isLoading ? "Saving..." : "Save Changes"}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <section>
          <h3 className="font-semibold mb-2">Ongoing ({buckets.ongoing.length})</h3>
          <div className="space-y-2">
            {buckets.ongoing.length === 0 ? (
              <p className="text-sm text-gray-500">No ongoing tasks</p>
            ) : (
              buckets.ongoing.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                  onEdit={(task) => {
                    setEditing(task);
                    setShowForm(false);
                  }}
                />
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Success ({buckets.success.length})</h3>
          <div className="space-y-2">
            {buckets.success.length === 0 ? (
              <p className="text-sm text-gray-500">No completed tasks</p>
            ) : (
              buckets.success.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                  onEdit={(task) => {
                    setEditing(task);
                    setShowForm(false);
                  }}
                />
              ))
            )}
          </div>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Failure ({buckets.failure.length})</h3>
          <div className="space-y-2">
            {buckets.failure.length === 0 ? (
              <p className="text-sm text-gray-500">No failed tasks</p>
            ) : (
              buckets.failure.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                  onEdit={(task) => {
                    setEditing(task);
                    setShowForm(false);
                  }}
                />
              ))
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleRefresh}
          className="px-3 py-2 border rounded-md text-sm"
          disabled={isLoading || anyMutating}
          aria-label="Refresh tasks"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}