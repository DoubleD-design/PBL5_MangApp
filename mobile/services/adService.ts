import api from "./api";

// Interface cho dữ liệu quảng cáo (tùy vào API của bạn trả về kiểu gì thì chỉnh lại cho phù hợp)
interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  [key: string]: any;
}

interface VIPStatusResponse {
  isVIP: boolean;
}

const adService = {
  // Get advertisement content
  getAds: async (): Promise<Ad[] | null> => {
    try {
      const response = await api.get<Ad[]>("/ads/display");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching ads:", error);
      return null;
    }
  },

  // Check if user is VIP (ad-free)
  isUserVIP: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return false;

      const response = await api.get<VIPStatusResponse>("/users/vip-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("VIP Status Response:", response.data);

      return response.data.isVIP === true;
    } catch (error) {
      console.error("Error checking VIP status:", error);
      return false;
    }
  },

  // Track ad impression
  trackImpression: async (adId: string): Promise<void> => {
    try {
      await api.post("/ads/impression", { adId });
    } catch (error) {
      console.error("Error tracking ad impression:", error);
    }
  },

  // Track ad click
  trackClick: async (adId: string): Promise<void> => {
    try {
      await api.post("/ads/click", { adId });
    } catch (error) {
      console.error("Error tracking ad click:", error);
    }
  },
};

export default adService;
