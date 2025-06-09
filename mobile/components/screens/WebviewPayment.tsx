import React, { useEffect, useRef, useState } from "react";
import { Alert, ActivityIndicator, Text, View } from "react-native";
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
  const [hasHandled, setHasHandled] = useState(false); // ngăn gọi lại nhiều lần
  const webviewRef = useRef(null);

  useEffect(() => {
    console.log("approvalUrl:", approvalUrl);
    console.log("orderId:", orderId);
  }, []);

  const handleNavigationChange = async (navState: any) => {
    const { url } = navState;
    if (!url || hasHandled) return;

    if (url.includes("payment-success")) {
      setHasHandled(true);
      setLoading(true);
      try {
        const result = await subscriptionService.capturePayment(orderId);
        if (result.success) {
          Alert.alert("Success", "Your VIP subscription is now active!", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert("Error", result.message || "Payment capture failed.");
          setHasHandled(false); // cho retry nếu cần
        }
      } catch (error) {
        Alert.alert("Error", "Failed to complete payment.");
        setHasHandled(false);
      } finally {
        setLoading(false);
      }
    } else if (url.includes("payment-cancel")) {
      setHasHandled(true);
      Alert.alert("Cancelled", "Payment was cancelled.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  };

  if (!approvalUrl?.trim()) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "red" }}>
          Error: approvalUrl is missing.
        </Text>
      </View>
    );
  }

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
