import apiClient from './client';

/** GET /api/task */
export const getTasks = async () => {
  const { data } = await apiClient.get('/task');
  const raw = data.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.tasks)) return raw.tasks;
  if (Array.isArray(data.tasks)) return data.tasks;
  return [];
};

/** POST /api/task/:id/claim */
export const submitTask = async (taskId) => {
  const { data } = await apiClient.post(`/task/${taskId}/claim`);
  return data;
};
