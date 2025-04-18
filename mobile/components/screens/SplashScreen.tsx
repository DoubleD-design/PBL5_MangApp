import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GRADIENTS } from '../../utils/const';
import { LinearGradient } from 'expo-linear-gradient';

interface SplashScreenProps {
  navigation: any; 
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    console.log('[HomeScreen] Mounted!');
    const timer = setTimeout(() => {
      navigation.navigate("Home")
    }, 2000); 

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient {...GRADIENTS.BLACK_WHITE_HALF} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.mangavn}>
          <Text style={{ color: '#FF9800' }}>MANGA</Text>
          <Text style={{ color: '#FFFFFF' }}>VN</Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradient: {
    flex: 1, // Chiếm toàn bộ màn hình
    justifyContent: 'center', // Canh giữa theo chiều dọc
    alignItems: 'center', // Canh giữa theo chiều ngang
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    color: '#FFA500', 
    fontSize: 40, 
    fontWeight: 'bold',
    letterSpacing: 2, 
  },
  mangavn: {
    textShadowColor: '#000000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 4,
    fontSize: 37,
    fontWeight: 'bold',
  }
});

export default SplashScreen;
