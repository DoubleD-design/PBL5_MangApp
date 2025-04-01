import { View, Text, StyleSheet, Dimensions, StatusBar, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Text style={styles.logo}>
        MANGA<Text style={styles.vn}>VN</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: width * 0.12,
    fontWeight: 'bold',
    color: '#f7931e',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: Platform.OS === 'android' ? 4 : 2, height: Platform.OS === 'android' ? 4 : 2 },
    textShadowRadius: 6,
  },
  vn: {
    color: '#fff',
  },
});
