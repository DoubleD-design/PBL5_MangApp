import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from './profile/ProfileScreen';
import HomeScreen from './screens/HomeScreen';
import TeamsScreen from './teams/TeamsScreen';
import HistoryScreen from './history/HistoryScreen';
import FavouritesScreen from './favourites/FavouritesScreen';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Library':
              iconName = 'library-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            case 'History':
              iconName = 'time-outline';
              break;
            case 'Favourites':
              iconName = 'heart-outline';
              break;
            case 'Translators':
              iconName = "pencil-outline"
              break;
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#1f1f1f',
          height: 60,
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      {/* <Tab.Screen name="Translators" component={TeamsScreen} /> */}
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
