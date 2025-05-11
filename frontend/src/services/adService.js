import api from "./api";

const adService = {
  // Get advertisement content
  getAds: async () => {
    try {
      const response = await api.get("/ads/display");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching ads:", error);
      return null;
    }
  },

  // Check if user is VIP (ad-free)
  isUserVIP: async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      // If no token, user is not logged in, so not VIP
      if (!token) return false;

      // Check user status from API
      const response = await api.get("/users/vip-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("VIP Status Response:", response.data);

      return response.data.isVIP === true;
    } catch (error) {
      console.error("Error checking VIP status:", error);
      return false; // Default to showing ads if there's an error
    }
  },

  // Track ad impression
  trackImpression: async (adId) => {
    try {
      await api.post("/ads/impression", { adId });
    } catch (error) {
      console.error("Error tracking ad impression:", error);
    }
  },

  // Track ad click
  trackClick: async (adId) => {
    try {
      await api.post("/ads/click", { adId });
    } catch (error) {
      console.error("Error tracking ad click:", error);
    }
  },
};

export default adService;
