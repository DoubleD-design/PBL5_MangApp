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
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '../../utils/const';
import FeaturedCarousel from '../FeaturedCarousel'; // Adjust the path to your FeaturedCarousel file
import MangaSection from '../MangaSection';
import SearchBar from '../SearchBar';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const HomeScreen = () => {
  return (
    <LinearGradient {...GRADIENTS.BACKGROUND} style={styles.gradient}>
      <View style={{ flex: 1, backgroundColor: '#2c1a0e' }}>
        <SearchBar />

        <ScrollView showsVerticalScrollIndicator={false} style = {{marginTop: 10, flex: 1}}>
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
