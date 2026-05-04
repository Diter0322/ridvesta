import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../api/dashboard';
import { getProfile } from '../api/profile';

export const DASHBOARD_KEY = ['dashboard'];

/** Fetch dashboard data */
export const useDashboard = () =>
  useQuery({
    queryKey: DASHBOARD_KEY,
    queryFn: getDashboard,
  });

/** Fetch profile — re-exports useProfile so Home can use a single import */
export { useProfile } from './useProfile';
