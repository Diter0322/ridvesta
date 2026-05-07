import apiClient from './client';

/** GET /api/deposit/history */
export const getDeposits = async () => {
  const { data } = await apiClient.get('/deposit/history');
  return data.data ?? {};
};

/** GET /api/deposit/status/{orderNum} */
export const getDepositStatus = async (orderNum) => {
  const { data } = await apiClient.get(`/deposit/status/${orderNum}`);
  return data.data ?? data;
};

/** POST /api/deposit-jayapay */
export const createDeposit = async (payload) => {
  const { data } = await apiClient.post('/deposit-jayapay', payload);
  return data;
};
