import { useMutation } from '@tanstack/react-query';
import { submitBonusCode } from '../api/bonus';

export const useSubmitBonusCode = () =>
  useMutation({
    mutationFn: submitBonusCode,
  });