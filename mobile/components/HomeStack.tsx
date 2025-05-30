import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import MostViewsListScreen from './screens/MostViewsListScreen';
import MostFavouritesListScreen from './screens/MostFavouritesListScreen';
import UpdateListScreen from './screens/UpdateListScreen';
import MangaListScreen from './screens/MangaListScreen';
import CategoryMangaListScreen from './screens/CategoryMangaListScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        
        <Stack.Screen name="UpdateList" component={UpdateListScreen} />
        <Stack.Screen name="MangaList" component={MangaListScreen} />
        <Stack.Screen name="MostViewsList" component={MostViewsListScreen} />
        <Stack.Screen name="MostFavouritesList" component={MostFavouritesListScreen} />
    </Stack.Navigator>
  );
}
