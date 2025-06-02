import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import favoriteService from '../../services/favoriteService';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3 - 16;

const FavouritesScreen = () => {
  const navigation = useNavigation();
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      try {
        const data = await favoriteService.getUserFavorites();
        setFavorites(data);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setIsCheckingLogin(false);
        setLoading(false);
      }
    })();
  }, []);

  if (loading || isCheckingLogin) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('MangaDetail', { manga: item })}
      style={styles.itemContainer}
    >
      <Image
        source={{ uri: item.coverImage || 'https://via.placeholder.com/150' }}
        style={styles.coverImage}
        resizeMode="cover"
      />
      <Text style={styles.titleText} numberOfLines={2}>
        {item.title || 'No Title'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.headerText}>
        Favourites
      </Text>

      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#2c1a0e',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    margin: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  coverImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  titleText: {
    color: 'white',
    marginTop: 6,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default FavouritesScreen;
