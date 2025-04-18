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
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '../../utils/const';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const bannerData = [
  { id: '1', title: 'Attack on Titan', author: 'Hajime Isayama', image: require('../../assets/manga/aot.jpg') },
  { id: '2', title: 'Oyasumi, Punpun', author: 'Asano Inio', image: require('../../assets/manga/punpun.jpg') },
  { id: '3', title: 'Shounen no Abyss', author: 'Minenami Ryo', image: require('../../assets/manga/sna.jpg') },
  { id: '4', title: 'Made in Abyss', author: 'Akihito Tsukushi', image: require('../../assets/manga/mia.jpg') },
];

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
    <View >
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
        </View>

        {bannerData.length > 0 && (
          <View style={{ marginTop: 10, marginBottom: 20 }}>
            <Carousel
              width={width}
              height={250}
              data={bannerData}
              renderItem={({ item }) => (
                <View>
                  <Image
                    source={item.image}
                    style={{ width: width, height: 250, borderRadius: 10 }}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.6)']}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 100,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      overflow: 'hidden',
                    }}
                  >
                    <BlurView
                      intensity={20} // độ mờ từ 0 -> 100
                      tint="light" // hoặc 'dark', 'default'
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 10,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        overflow: 'hidden',
                      }}
                    >
                      <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 23 }}>
                        {item.title}
                      </Text><Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                        {item.author}
                      </Text>
                    </BlurView>
                  </LinearGradient>
                </View>
              )}
              autoPlay
              loop
            />
          </View>
        )}
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