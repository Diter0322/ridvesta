import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDeposits, getDepositStatus, createDeposit } from '../api/deposits';

export const DEPOSITS_KEY = ['deposits'];

export const useDeposits = () =>
  useQuery({
    queryKey: DEPOSITS_KEY,
    queryFn: getDeposits,
  });

export const useDepositStatus = (orderNum, options = {}) =>
  useQuery({
    queryKey: ['depositStatus', orderNum],
    queryFn: () => getDepositStatus(orderNum),
    enabled: !!orderNum && orderNum !== '—',
    ...options,
  });

export const useCreateDeposit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDeposit,
    onSuccess: () => qc.invalidateQueries({ queryKey: DEPOSITS_KEY }),
  });
};
