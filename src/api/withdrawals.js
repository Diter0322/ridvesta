import apiClient from './client';

/** GET /api/withdraw - withdraw config + bank info */
export const getWithdrawConfig = async () => {
  const { data } = await apiClient.get('/withdraw');
  return data.data ?? data;
};

/** GET /api/withdraw/history */
export const getWithdrawals = async () => {
  const { data } = await apiClient.get('/withdraw/history');
  return data.data ?? {};
};

/** POST /api/withdraw-confirm-jayapay */
export const createWithdrawal = async (payload) => {
  const { data } = await apiClient.post('/withdraw-confirm-jayapay', payload);
  return data;
};
