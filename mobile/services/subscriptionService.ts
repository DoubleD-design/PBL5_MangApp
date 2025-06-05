import api from "./api";

type PackageType = "monthly" | "yearly" | string;

interface CreateOrderResponse {
  id: string;
  status: string;
  approvalUrl: string;
}

interface CapturePaymentResponse {
  success: boolean;
  message: string;
}

interface VipStatusResponse {
  isVip: boolean;
  expiresAt: string;
}

const subscriptionService = {
  // Create a PayPal order for VIP subscription
  createOrder: async (
    userId: string,
    packageType: PackageType
  ): Promise<CreateOrderResponse> => {
    try {
      const response = await api.post("/vip-subscription/create-order", {
        userId,
        packageType,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating subscription order:", error);
      throw error;
    }
  },

  // Capture payment for a completed order
  capturePayment: async (orderId: string): Promise<CapturePaymentResponse> => {
    try {
      const response = await api.post(
        `/vip-subscription/capture-payment?orderId=${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error capturing payment:", error);
      throw error;
    }
  },

  // Get VIP status for a user
  getVipStatus: async (userId: string): Promise<VipStatusResponse> => {
    try {
      const response = await api.get(`/vip-subscription/status/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting VIP status:", error);
      throw error;
    }
  },
};

export default subscriptionService;
