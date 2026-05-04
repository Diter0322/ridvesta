import apiClient from './client';
import { API_HOST } from '../config/api';

const resolvePhoto = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  return `${API_HOST}/${photo.replace(/^\//, '')}`;
};

/** GET /api/me */
export const getProfile = async () => {
  const { data } = await apiClient.get('/me');
  const profile = data.data ?? data;
  return { ...profile, photo: resolvePhoto(profile.photo) };
};

/** POST /api/profile/photo/submit  (multipart) */
export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await apiClient.post('/profile/photo/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  const result = data.data ?? data;
  return { ...result, photo: resolvePhoto(result.photo) };
};
