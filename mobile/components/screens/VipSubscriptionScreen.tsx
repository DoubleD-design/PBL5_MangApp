import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import subscriptionService from '../../services/subscriptionService';
import { useNavigation } from '@react-navigation/native';
import { virtualAndroidID } from '../../utils/const';

interface SubscriptionPackage {
  id: string;
  title: string;
  price: string;
  period: string;
  image: string;
  recommended?: boolean;
  features: string[];
}

interface VipStatus {
  isVip: boolean;
  expiresAt: string;
}

const subscriptionPackages: SubscriptionPackage[] = [
  {
    id: 'monthly',
    title: 'Monthly Plan',
    price: '$1.25',
    period: 'month',
    image: 'http://' + virtualAndroidID + ':8080/vip/monthly_vip.jpeg',
    features: ['Ad-free reading experience', 'Access to all premium manga', 'Early access to new chapters', 'High-quality images', 'Download chapters for offline reading'],
  },
  {
    id: 'yearly',
    title: 'Yearly Plan',
    price: '$12.5',
    period: 'year',
    image: 'http://' + virtualAndroidID + ':8080/vip/yearly_vip.jpeg',
    recommended: true,
    features: ['All Monthly VIP benefits', 'Save 17% compared to monthly plan', 'Exclusive seasonal content', 'Priority customer support', 'Participate in beta features'],
  },
];

const VipSubscriptionScreen: React.FC = () => {
  const [vipStatus, setVipStatus] = useState<VipStatus | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const userId = 'user123'; // Replace with actual userId logic

  useEffect(() => {
    const fetchVipStatus = async () => {
      try {
        const res = await subscriptionService.getVipStatus(userId);
        setVipStatus(res);
      } catch (e) {
        console.error(e);
      }
    };
    fetchVipStatus();
  }, []);

  const handleSubscribe = async (pkg: SubscriptionPackage) => {
    try {
      setLoadingId(pkg.id);
      const order = await subscriptionService.createOrder(userId, pkg.id);
      if (order.approvalUrl) {
        // navigation.navigate('WebviewPayment' as never);
      } else {
        throw new Error('Invalid payment link');
      }
    } catch (e) {
      setError('Failed to create subscription.');
      Alert.alert('Error', 'Subscription process failed.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
      <Text style={styles.title}>VIP Subscription</Text>
      <Text style={styles.subtitle}>
        Upgrade your manga experience with our VIP subscription plans
      </Text>

      {vipStatus?.isVip && (
        <View style={styles.vipAlert}>
          <Text style={styles.vipText}>
            You are currently a VIP! Valid until {new Date(vipStatus.expiresAt).toLocaleDateString()}.
          </Text>
        </View>
      )}

      {subscriptionPackages.map((pkg) => (
        <View
          key={pkg.id}
          style={[
            styles.card,
            pkg.recommended && styles.recommendedCard,
          ]}
        >
          {pkg.recommended && (
            <Text style={styles.recommendedLabel}>BEST VALUE</Text>
          )}
          <Image source={{ uri: pkg.image }} style={styles.image} />
          <Text style={styles.packageTitle}>{pkg.title}</Text>
          <Text style={styles.price}>{pkg.price} / {pkg.period}</Text>
          <View style={styles.features}>
            {pkg.features.map((f, i) => (
              <Text key={i} style={styles.featureItem}>• {f}</Text>
            ))}
          </View>
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              pkg.recommended && styles.recommendedButton,
            ]}
            disabled={!!loadingId}
            onPress={() => handleSubscribe(pkg)}
          >
            {loadingId === pkg.id ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {vipStatus?.isVip ? 'Extend Subscription' : 'Subscribe Now'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.benefitsSection}>
        <Text style={styles.benefitsTitle}>VIP Benefits</Text>
        <Text style={styles.benefit}>- Ad-Free Experience</Text>
        <Text style={styles.benefit}>- Premium Content Access</Text>
        <Text style={styles.benefit}>- High-Quality Images</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#171717',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgb(238, 220, 204)',
    marginBottom: 20,
  },
  vipAlert: {
    backgroundColor: '#d0f0fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  vipText: {
    color: '#0077aa',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  recommendedCard: {
    borderColor: '#ff6740',
    borderWidth: 2,
  },
  recommendedLabel: {
    backgroundColor: '#ff6740',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-end',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    height: 160,
    borderRadius: 10,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    color: '#0077cc',
    marginBottom: 8,
  },
  features: {
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  subscribeButton: {
    backgroundColor: '#0077cc',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  recommendedButton: {
    backgroundColor: '#ff6740',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  benefitsSection: {
    marginTop: 30,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  benefit: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: 20,
    color: "#333",
  },
  backArrow: {
    fontSize: 40,
    color: "#fff",
  },
});

export default VipSubscriptionScreen;
