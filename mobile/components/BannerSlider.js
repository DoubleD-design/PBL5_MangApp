import { View, Text, Image, StyleSheet, Dimensions, Platform, BackHandler } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

const banners = [
  { id: 1, title: 'Attack on Titan', author: 'Hajime Isayama', image: require('../assets/aot.jpg') },
  { id: 2, title: 'Goodnight Punpun', author: 'Someone', image: require('../assets/punpun.jpg') },
];

export default function BannerSlider() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backAction = () => {
        return true; // Ngăn thoát app khi bấm Back
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.banner}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.author}</Text>
      </View>
    </View>
  );

  return (
    <Carousel
      data={banners}
      renderItem={renderItem}
      sliderWidth={width}
      itemWidth={width - 40}
      autoplay
      loop
      autoplayInterval={3000}
      enableMomentum={false}
      lockScrollWhileSnapping
      inactiveSlideScale={0.9}
      inactiveSlideOpacity={0.7}
    />
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: '#222', // Đảm bảo hiển thị tốt trên Android
    paddingBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  textContainer: {
    paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  author: {
    color: '#ddd',
    fontSize: 14,
  },
});
