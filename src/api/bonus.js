import apiClient from './client';

/** POST /api/bonus/confirmation */
export const submitBonusCode = async (payload) => {
  const { data } = await apiClient.post('/bonus/confirmation', payload);
  return data;
};