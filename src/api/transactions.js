import apiClient from './client';

/** GET /api/income/history */
export const getTransactions = async () => {
  const { data } = await apiClient.get('/income/history');
  return data.data ?? data ?? {};
};
