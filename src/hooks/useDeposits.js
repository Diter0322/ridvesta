import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDeposits, createDeposit } from '../api/deposits';

export const DEPOSITS_KEY = ['deposits'];

export const useDeposits = () =>
  useQuery({
    queryKey: DEPOSITS_KEY,
    queryFn: getDeposits,
  });

export const useCreateDeposit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDeposit,
    onSuccess: () => qc.invalidateQueries({ queryKey: DEPOSITS_KEY }),
  });
};
