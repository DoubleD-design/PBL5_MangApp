import api from "./api";
const notificationService = {
  getNotificationsByUserId: async (userId) => {
    const res = await api.get(`/notifications/user/${userId}`);
    return res.data;
  },
  markAsRead: async (notificationId) => {
    await api.put(`/notifications/${notificationId}/read`);
  },
  markAllAsRead: async (userId) => {
    await api.put(`/notifications/user/${userId}/read-all`);
  },
};
export default notificationService;