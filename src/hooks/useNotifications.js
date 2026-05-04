import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUnreadCount,
  getRecentNotifications,
  markAsRead,
  markAllAsRead,
} from '../api/notifications';

export const NOTIF_COUNT_KEY = ['notifUnreadCount'];
export const NOTIF_RECENT_KEY = ['notifRecent'];

export const useUnreadCount = () =>
  useQuery({
    queryKey: NOTIF_COUNT_KEY,
    queryFn: getUnreadCount,
    refetchInterval: 30000,
  });

export const useRecentNotifications = (enabled = false) =>
  useQuery({
    queryKey: NOTIF_RECENT_KEY,
    queryFn: getRecentNotifications,
    enabled,
  });

export const useMarkAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIF_COUNT_KEY });
      qc.invalidateQueries({ queryKey: NOTIF_RECENT_KEY });
    },
  });
};

export const useMarkAllAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NOTIF_COUNT_KEY });
      qc.invalidateQueries({ queryKey: NOTIF_RECENT_KEY });
    },
  });
};
