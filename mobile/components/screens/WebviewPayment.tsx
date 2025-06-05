import React, { useEffect, useRef, useState } from "react";
import { Alert, ActivityIndicator, View } from "react-native";
import WebView from "react-native-webview";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import subscriptionService from "../../services/subscriptionService";

type RootStackParamList = {
  WebviewPayment: {
    approvalUrl: string;
    orderId: string;
  };
};

type WebviewPaymentRouteProp = RouteProp<RootStackParamList, "WebviewPayment">;

const WebviewPayment = () => {
  const route = useRoute<WebviewPaymentRouteProp>();
  const navigation = useNavigation();
  const { approvalUrl, orderId } = route.params;

  const [loading, setLoading] = useState(false);
  const webviewRef = useRef(null);

  const handleNavigationChange = async (navState: any) => {
    const { url } = navState;

    if (url.includes("payment-success")) {
      if (!loading) {
        setLoading(true);
        try {
          const result = await subscriptionService.capturePayment(orderId);
          if (result.success) {
            Alert.alert("Success", "Your VIP subscription is now active!");
            navigation.goBack();
          } else {
            Alert.alert("Error", result.message || "Payment capture failed.");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to complete payment.");
        } finally {
          setLoading(false);
        }
      }
    }

    if (url.includes("payment-cancel")) {
      Alert.alert("Cancelled", "Payment was cancelled.");
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: approvalUrl }}
        onNavigationStateChange={handleNavigationChange}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            style={{ flex: 1 }}
            size="large"
            color="#ff6740"
          />
        )}
      />
    </View>
  );
};

export default WebviewPayment;
