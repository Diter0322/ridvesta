import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../api/transactions';

export const TRANSACTIONS_KEY = ['transactions'];

export const useTransactions = () =>
  useQuery({
    queryKey: TRANSACTIONS_KEY,
    queryFn: getTransactions,
  });
