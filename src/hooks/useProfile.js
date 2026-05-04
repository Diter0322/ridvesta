import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, uploadProfilePhoto } from '../api/profile';

export const PROFILE_KEY = ['profile'];

/** Fetch the authenticated user's profile */
export const useProfile = () =>
  useQuery({
    queryKey: PROFILE_KEY,
    queryFn: getProfile,
  });

/** Upload a new profile photo and invalidate the cached profile */
export const useUploadProfilePhoto = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: (updatedPhoto) => {
      // Optimistically patch the cached profile instead of full refetch
      qc.setQueryData(PROFILE_KEY, (old) =>
        old ? { ...old, photo: updatedPhoto?.photo ?? updatedPhoto } : old
      );
    },
  });
};
