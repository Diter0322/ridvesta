import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWithdrawConfig, getWithdrawals, createWithdrawal } from '../api/withdrawals';

export const WITHDRAWALS_KEY = ['withdrawals'];
export const WITHDRAW_CONFIG_KEY = ['withdrawConfig'];

export const useWithdrawConfig = () =>
  useQuery({
    queryKey: WITHDRAW_CONFIG_KEY,
    queryFn: getWithdrawConfig,
  });

export const useWithdrawals = () =>
  useQuery({
    queryKey: WITHDRAWALS_KEY,
    queryFn: getWithdrawals,
  });

export const useCreateWithdrawal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createWithdrawal,
    onSuccess: () => qc.invalidateQueries({ queryKey: WITHDRAWALS_KEY }),
  });
};
