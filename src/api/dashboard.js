import apiClient from './client';

/** GET /api/dashboard */
export const getDashboard = async () => {
  const { data } = await apiClient.get('/dashboard');
  return data.data ?? null;
};
