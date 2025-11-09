import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";
import toast from "react-hot-toast";

const fetchTasks = async () => {
  const { data } = await api.get("/tasks");
  return data;
};

export function useTasks() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: 1000 * 60, // 1 minute
    // refetchInterval: false, // default is false
  });

  const createTask = useMutation({
    mutationFn: (newTask) => api.post("/tasks", newTask).then((r) => r.data),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData(["tasks"]) || [];
      const optimistic = [
        ...previous,
        {
          ...newTask,
          id: `temp-${Date.now()}`,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      queryClient.setQueryData(["tasks"], optimistic);
      return { previous };
    },
    onError: (err, newTask, context) => {
      if (context?.previous) queryClient.setQueryData(["tasks"], context.previous);
      toast.error("Failed to create task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, updates }) => api.put(`/tasks/${id}`, updates).then((r) => r.data),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old = []) => old.map((t) => (t.id === id ? { ...t, ...updates } : t)));
      return { previous };
    },
    onError: (err, vars, context) => {
      if (context?.previous) queryClient.setQueryData(["tasks"], context.previous);
      toast.error("Update failed");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTask = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`).then((r) => r.data),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old = []) => old.filter((t) => t.id !== id));
      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) queryClient.setQueryData(["tasks"], context.previous);
      toast.error("Delete failed");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return {
    ...query,
    createTask,
    updateTask,
    deleteTask,
  };
}