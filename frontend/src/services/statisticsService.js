import api from "./api";

const statisticsService = {
  // Get dashboard summary statistics
  getDashboardSummary: async () => {
    try {
      const response = await api.get("/admin/statistics/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      throw error;
    }
  },

  // Get revenue data with optional date range
  getRevenueData: async (startDate, endDate) => {
    try {
      let url = "/admin/statistics/revenue";
      const params = {};

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      throw error;
    }
  },

  // Get top manga with optional date range and limit
  getTopManga: async (startDate, endDate, limit = 5) => {
    try {
      let url = "/admin/statistics/top-manga";
      const params = { limit };

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching top manga:", error);
      throw error;
    }
  },

  // Get user statistics with optional date range
  getUserStats: async (startDate, endDate) => {
    try {
      let url = "/admin/statistics/users";
      const params = {};

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      throw error;
    }
  },

  // Get payment statistics with optional date range
  getPaymentStats: async (startDate, endDate) => {
    try {
      let url = "/admin/statistics/payments";
      const params = {};

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching payment statistics:", error);
      throw error;
    }
  },

  // Get subscription statistics with optional date range
  getSubscriptionStats: async (startDate, endDate) => {
    try {
      let url = "/admin/statistics/subscriptions";
      const params = {};

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching subscription statistics:", error);
      throw error;
    }
  },
};

export default statisticsService;
