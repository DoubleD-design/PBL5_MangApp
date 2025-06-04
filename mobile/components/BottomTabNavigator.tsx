import React, { useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from './profile/ProfileScreen';
import HomeStack from './HomeStack';
import HistoryScreen from './history/HistoryScreen';
import FavouritesScreen from './favourites/FavouritesScreen';
import CategoryModal from './../components/CategoryModal'; // thêm dòng này

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const [isCategoryVisible, setCategoryVisible] = useState(false);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, focused }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Category':
                iconName = 'grid-outline';
                break;
              case 'Favourites':
                iconName = 'heart-outline';
                break;
              // case 'History':
              //   iconName = 'time-outline';
              //   break;
              case 'Profile':
                iconName = 'person-outline';
                break;
            }

            return <Ionicons name={iconName as any} size={24} color={color} />;
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

        <Tab.Screen
          name="Category"
          component={() => null} // không hiển thị gì cả
          listeners={{
            tabPress: e => {
              e.preventDefault(); // chặn điều hướng
              setCategoryVisible(true); // mở modal
            },
          }}
        />

        <Tab.Screen name="Favourites" component={FavouritesScreen} />
        {/* <Tab.Screen name="History" component={HistoryScreen} /> */}
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      <CategoryModal visible={isCategoryVisible} onClose={() => setCategoryVisible(false)} />
    </>
  );
}
