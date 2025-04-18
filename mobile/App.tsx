import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './components/screens/SplashScreen'; 
import HomeScreen from './components/screens/HomeScreen';
import UpdateListScreen from './components/screens/UpdateListScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="UpdateList" component={UpdateListScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;