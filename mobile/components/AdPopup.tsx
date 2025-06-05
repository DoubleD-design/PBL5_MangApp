import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";
import adService from "../services/adService";
import { virtualAndroidID } from "../utils/const";
import { useNavigation } from "@react-navigation/native";

interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  description?: string;
  callToAction?: string;
  createAt?: string;
  isActive?: boolean;
}

interface AdPopupProps {
  visible: boolean;
  onClose: () => void;
}

const AdPopup: React.FC<AdPopupProps> = ({ visible, onClose }) => {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (!visible || hasFetched.current) return;

    hasFetched.current = true;

    const fetchAd = async () => {
      try {
        setLoading(true);
        const isVIP = await adService.isUserVIP();
        if (isVIP) {
          onClose();
          return;
        }

        const adData = await adService.getAds();
        if (adData && adData.length > 0) {
          setAd(adData[0]);
          adService.trackImpression(adData[0].id);
        }
      } catch (err) {
        console.error("Error loading ad:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [visible, onClose]);

  const handleAdClick = () => {
    if (ad) {
      adService.trackClick(ad.id);
      if (ad.link) {
        Linking.openURL(ad.link);
      }
      else alert("quang cao loi");
    }
  };

  const handleSubscribe = () => {
    // Linking.openURL("https://yourapp.com/vip-subscription");
    navigation.navigate("VipSubscription" as never);
  };

  if (!visible || loading || !ad) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{ad.title || "Quảng cáo"}</Text>

          <TouchableOpacity onPress={handleAdClick}>
            <Image
              source={{ uri: `http://${virtualAndroidID}:8080/ads/Vietnam_Travel_Ad_Facebook_Post.jpg` }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {ad.description && (
            <Text style={styles.description}>{ad.description}</Text>
          )}

          {ad.callToAction && (
            <TouchableOpacity onPress={handleSubscribe} style={styles.ctaButton}>
              <Text style={styles.ctaText}>{ad.callToAction}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 6,
    right: 10,
    zIndex: 1,
  },
  closeText: {
    fontSize: 26,
    color: "#999",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  description: {
    textAlign: "center",
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 8,
  },
  ctaText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AdPopup;
