import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import BottomTabNavigator from './BottomTabNavigator';
import MangaDetailScreen from './screens/MangaDetailScreen';
import ReadingScreen from './screens/ReadingScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      <Stack.Screen name="MangaDetail" component={MangaDetailScreen} />
      <Stack.Screen name="Reading" component={ReadingScreen} />
    </Stack.Navigator>
  );
}
