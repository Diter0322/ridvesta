import apiClient from './client';

/** GET /api/team */
export const getTeam = async () => {
  const { data } = await apiClient.get('/team');
  return data.data ?? null;
};

/** GET /api/team/summary */
export const getTeamSummary = async () => {
  const { data } = await apiClient.get('/team/summary');
  return data.data ?? null;
};
