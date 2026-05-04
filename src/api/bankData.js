import apiClient from './client';

/** GET /api/bank/list  (also returns current user bank_data) */
export const getBankData = async () => {
  const { data } = await apiClient.get('/bank/list');
  return data.data ?? null;
};

/** POST /api/bank/save */
export const saveBankData = async (payload) => {
  const { data } = await apiClient.post('/bank/save', payload);
  return data;
};
