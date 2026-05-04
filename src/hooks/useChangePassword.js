import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../api/auth';

export const useChangePassword = () =>
  useMutation({
    mutationFn: changePassword,
  });
