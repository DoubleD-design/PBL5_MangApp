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
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const bannerData = [
  { id: '1', title: 'Attack on Titan', image: require('../../assets/aot.jpg') },
  { id: '2', title: 'Punpun', image: require('../../assets/aot.jpg') },
  { id: '3', title: 'Abyss', image: require('../../assets/aot.jpg') },
];

const mangaData = [
  { id: '1', title: 'Attack on Titan', chapter: 'Chap 139', image: require('../../assets/aot.jpg') },
  { id: '2', title: 'Oyasumi, Punpun', chapter: 'Chap 147', image: require('../../assets/aot.jpg') },
  { id: '3', title: 'Shounen no Abyss', chapter: 'Chap 173', image: require('../../assets/aot.jpg') },
  { id: '4', title: 'Made in Abyss', chapter: 'Chap 62', image: require('../../assets/aot.jpg') },
];

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const popularData = mangaData;
  const favoriteData = [...popularData];
  const updatedData = [...popularData];
  const allData = [...popularData];

  const renderCarouselItem = ({ item }: any) => (
    <Image
      source={item.image}
      style={{
        width: width - 40,
        height: 200,
        borderRadius: 10,
      }}
      resizeMode="cover"
    />
  );

  const renderItem = ({ item }: any) => (
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

  const Section = ({
    title,
    data,
  }: {
    title: string;
    data: any[];
  }) => (
    <View style={{ marginTop: 20 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 20,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('MangaListScreen', { title, data })}
        >
          <Text style={{ color: '#bbb' }}>Xem thêm</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, marginTop: 10 }}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#1c1c1e' }}>
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
        <Image
          source={require('../../assets/aot.jpg')}
          style={{ width: 20, height: 20, tintColor: '#fff' }}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Carousel
          data={bannerData}
          renderItem={renderCarouselItem}
          sliderWidth={width}
          itemWidth={width - 40}
          autoplay
          loop
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Section title="Most views" data={popularData} />
        <Section title="Most favourites" data={favoriteData} />
        <Section title="Latest update" data={updatedData} />
        <Section title="All mangas" data={allData} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;