import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MANGA<Text style={styles.vn}>VN</Text></Text>
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
    fontSize: width * 0.12, // 12% của chiều rộng màn hình (~90px trên iPhone 7)
    fontWeight: 'bold',
    color: '#f7931e',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  vn: {
    color: '#fff',
  },
});
