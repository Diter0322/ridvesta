import { useQuery } from '@tanstack/react-query';
import { getReferralLevel } from '../api/referral';

export const referralLevelKey = (level) => ['referral', level];

export const useReferralLevel = (level) =>
  useQuery({
    queryKey: referralLevelKey(level),
    queryFn: () => getReferralLevel(level),
    enabled: !!level,
  });
