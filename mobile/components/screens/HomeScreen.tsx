import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '../../utils/const';
import FeaturedCarousel from '../FeaturedCarousel'; // Adjust the path to your FeaturedCarousel file

const { width } = Dimensions.get('window');

const mangaData = [
  { id: '1', title: 'Attack on Titan', chapter: 'Chap 139', image: require('../../assets/manga/aot.jpg') },
  { id: '2', title: 'Oyasumi, Punpun', chapter: 'Chap 147', image: require('../../assets/manga/punpun.jpg') },
  { id: '3', title: 'Shounen no Abyss', chapter: 'Chap 173', image: require('../../assets/manga/sna.jpg') },
  { id: '4', title: 'Made in Abyss', chapter: 'Chap 62', image: require('../../assets/manga/mia.jpg') },
];

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const popularData = mangaData;
  const favoriteData = [...popularData];
  const updatedData = [...popularData];
  const allData = [...popularData];

  const renderItem = ({ item }: any) => {
    if (!item.image) return null; // Kiểm tra xem item có thuộc tính image không
    return (
      <View style={{ marginRight: 12, width: 100 }}>
        <Image
          source={item.image}
          style={{ width: 100, height: 140, borderRadius: 10 }}
          resizeMode="cover"
        />
        <Text style={{ color: '#fff', fontWeight: 'bold', marginTop: 5 }}>{item.title}</Text>
        <Text style={{ color: '#aaa', fontSize: 12 }}>{item.chapter}</Text>
      </View>
    );
  };

  const Section = ({
    title,
    data,
  }: {
    title: string;
    data: any[];
  }) => (
    <View style={{ marginTop: 5 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
        <TouchableOpacity
          onPress={() => {
            if (title === 'Latest update') {
              navigation.navigate('UpdateList', { title, data });
            } else if (title === 'All mangas') {
              navigation.navigate('MangaList', { title, data });
            } else if (title === 'Most views') {
              navigation.navigate('MostViewsList', { title, data });
            } else if (title === 'Most favourites') {
              navigation.navigate('MostFavouritesList', { title, data });
            }
          }}
        >
          <Text style={{ color: '#bbb' }}>See more {'>>'} </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, marginTop: 10 }}
      />
    </View>
  );

  return (
    <LinearGradient {...GRADIENTS.BACKGROUND} style={styles.gradient}>
      <View style={{ flex: 1, backgroundColor: '#2c1a0e' }}>
        <View
          style={{
            marginTop: 50,
            marginHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#333',
            borderRadius: 10,
            paddingHorizontal: 10,
            height: 40,
          }}
        >
          <TextInput
            placeholder="Searching..."
            placeholderTextColor="#aaa"
            style={{ flex: 1, color: '#fff' }}
          />
        </View>

        <FeaturedCarousel /> {/* Here is the new FeaturedCarousel */}

        <ScrollView showsVerticalScrollIndicator={false}>
          <Section title="Most views" data={popularData} />
          <Section title="Most favourites" data={favoriteData} />
          <Section title="Latest update" data={updatedData} />
          <Section title="All mangas" data={allData} />
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1, // Chiếm toàn bộ màn hình
    justifyContent: 'center', // Canh giữa theo chiều dọc
    alignItems: 'center', // Canh giữa theo chiều ngang
  }
});

export default HomeScreen;
