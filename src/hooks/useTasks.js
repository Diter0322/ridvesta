import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, submitTask } from '../api/tasks';

export const TASKS_KEY = ['tasks'];

/** Fetch all tasks for the authenticated user */
export const useTasks = () =>
  useQuery({
    queryKey: TASKS_KEY,
    queryFn: getTasks,
  });

/** Claim/submit a task by id and refresh the task list */
export const useSubmitTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (taskId) => submitTask(taskId),
    onSuccess: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  });
};
