import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const mangaData = [
  {
    id: '1',
    title: 'Attack on Titan',
    chapter: 'Chap 139',
    image: require('../../assets/manga/aot.jpg'),
  },
  {
    id: '2',
    title: 'Oyasumi, Punpun',
    chapter: 'Chap 147',
    image: require('../../assets/manga/punpun.jpg'),
  },
  {
    id: '3',
    title: 'Shounen no Abyss',
    chapter: 'Chap 173',
    image: require('../../assets/manga/sna.jpg'),
  },
  {
    id: '4',
    title: 'Kimi no koto nado',
    chapter: 'Chap 40',
    image: require('../../assets/manga/aot.jpg'),
  },
  {
    id: '5',
    title: 'Kimetsu no Yaiba',
    chapter: 'Chap 189',
    image: require('../../assets/manga/kny.jpg'),
  },
  {
    id: '6',
    title: 'Takopi no genzai',
    chapter: 'Chap 16',
    image: require('../../assets/manga/takopi.jpg'),
  },
];

const ITEM_WIDTH = width / 3 - 16;

const MostFavouritesListScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }: any) => (
    <View style={{ width: ITEM_WIDTH, margin: 8 }}>
      <Image
        source={item.image}
        style={{ width: '100%', height: 150, borderRadius: 12 }}
        resizeMode="cover"
      />
      <Text style={{ color: 'white', marginTop: 6, fontWeight: 'bold' }} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={{ color: 'white', fontSize: 12 }}>{item.chapter}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#2c1a0e' }}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }}
      >
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 50, marginBottom: 10, alignSelf: 'center' }}>
        Most Favourites List
      </Text>

      {/* Manga Grid */}
      <FlatList
        data={mangaData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MostFavouritesListScreen;
