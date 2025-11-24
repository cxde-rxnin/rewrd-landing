import { useState, useCallback } from "react";
import { TaskAPI } from "../../services/api";

export function useTasks(accessToken: string | null) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await TaskAPI.getAll(accessToken);
      let tasksArr: any[] = [];
      if (Array.isArray(data)) {
        tasksArr = data;
      } else if (data && Array.isArray((data as any).data)) {
        tasksArr = (data as any).data;
      }
      setTasks(tasksArr);
      console.log("Fetched tasks:", tasksArr);
      setLoading(false);
      return tasksArr;
    } catch (e: any) {
      setError(e?.message || "Failed to fetch tasks");
      setLoading(false);
      console.error("Error fetching tasks:", e);
    }
  }, [accessToken]);

  const createTask = useCallback(async (taskData: any) => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await TaskAPI.create(accessToken, taskData);
      setLoading(false);
      return data;
    } catch (e: any) {
      setError(e?.message || "Failed to create task");
      setLoading(false);
      throw e; // propagate error to caller
    }
  }, [accessToken]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    setTasks,
  };
}
