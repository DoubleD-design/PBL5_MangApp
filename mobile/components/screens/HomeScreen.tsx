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

        

        <ScrollView showsVerticalScrollIndicator={false} style = { {marginTop: 10} }>
          <View><FeaturedCarousel /> </View>
          <MangaSection title="Most views" />
          <MangaSection title="Latest update" />
          <MangaSection title="All mangas" />
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
