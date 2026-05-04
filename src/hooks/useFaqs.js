import { useQuery } from '@tanstack/react-query';
import { getFaqs } from '../api/faqs';

export const FAQS_KEY = ['faqs'];

export const useFaqs = () =>
  useQuery({
    queryKey: FAQS_KEY,
    queryFn: getFaqs,
  });
