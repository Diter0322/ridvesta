import apiClient from './client';

/** POST /api/my/change/password */
export const changePassword = async ({ current_password, new_password, confirm_password }) => {
  const { data } = await apiClient.post('/my/change/password', {
    current_password,
    new_password,
    confirm_password,
  });
  return data;
};
