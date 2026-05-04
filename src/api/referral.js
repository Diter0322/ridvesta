import apiClient from './client';

/** GET /api/team/:level */
export const getReferralLevel = async (level) => {
  const { data } = await apiClient.get(`/team/${level}`);
  return data.data ?? null;
};
