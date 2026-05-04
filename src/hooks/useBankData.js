import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBankData, saveBankData } from '../api/bankData';

export const BANK_DATA_KEY = ['bankData'];

export const useBankData = () =>
  useQuery({
    queryKey: BANK_DATA_KEY,
    queryFn: getBankData,
  });

export const useSaveBankData = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveBankData,
    onSuccess: () => qc.invalidateQueries({ queryKey: BANK_DATA_KEY }),
  });
};
