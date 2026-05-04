import apiClient from './client';

/** GET /api/notifications/unread/count */
export const getUnreadCount = async () => {
  const { data } = await apiClient.get('/notifications/unread/count');
  return data.data ?? data;
};

/** GET /api/notifications/recent */
export const getRecentNotifications = async () => {
  const { data } = await apiClient.get('/notifications/recent');
  return data.data ?? data;
};

/** POST /api/notifications/{id}/read */
export const markAsRead = async (id) => {
  const { data } = await apiClient.post(`/notifications/${id}/read`);
  return data;
};

/** GET /api/notifications/read-all */
export const markAllAsRead = async () => {
  const { data } = await apiClient.get('/notifications/read-all');
  return data;
};
