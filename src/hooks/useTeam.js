import { useQuery } from '@tanstack/react-query';
import { getTeam, getTeamSummary } from '../api/team';

export const TEAM_KEY = ['team'];
export const TEAM_SUMMARY_KEY = ['team', 'summary'];

export const useTeam = () =>
  useQuery({
    queryKey: TEAM_KEY,
    queryFn: getTeam,
  });

export const useTeamSummary = () =>
  useQuery({
    queryKey: TEAM_SUMMARY_KEY,
    queryFn: getTeamSummary,
  });
