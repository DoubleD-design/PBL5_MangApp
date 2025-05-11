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
import MangaSection from '../MangaSection';
import SearchBar from '../SearchBar';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<any>();

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

  return (
    <LinearGradient {...GRADIENTS.BACKGROUND} style={styles.gradient}>
      <View style={{ flex: 1, backgroundColor: '#2c1a0e' }}>
        <SearchBar />

        <ScrollView showsVerticalScrollIndicator={false} style = { {marginTop: 10} }>
          <View><FeaturedCarousel /> </View>
          <MangaSection title="Most Views" />
          <MangaSection title="Latest Update" />
          <MangaSection title="All Mangas" />
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
