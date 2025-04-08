import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GRADIENTS } from '../../utils/const';
import LinearGradient from 'react-native-linear-gradient';

interface SplashScreenProps {
  navigation: any; 
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    
    const timer = setTimeout(() => {
      navigation.replace('Main'); 
    }, 2000); 

   
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient {...GRADIENTS.BLACK_WHITE_HALF} >
        <Text style = {[{color: 'FF9800'}, styles.shadow]}>MANGA</Text>
        <Text style = {[{color: 'FFFFFF'}, styles.shadow]}>VN</Text>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  logo: {
    color: '#FFA500', 
    fontSize: 40, 
    fontWeight: 'bold',
    letterSpacing: 2, 
  },
  shadow: {
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  }
});

export default SplashScreen;