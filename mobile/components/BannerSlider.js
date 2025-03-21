import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const { width } = Dimensions.get('window');

const banners = [
  { id: 1, title: 'Attack on Titan', author: 'Hajime Isayama', image: require('../assets/aot.jpg') },
  { id: 2, title: 'Jujutsu Kaisen', author: 'Gege Akutami', image: require('../assets/jujutsu.jpg') },
];

export default function BannerSlider() {
  return (
    <Carousel
      data={banners}
      renderItem={({ item }) => (
        <View style={styles.banner}>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>{item.author}</Text>
        </View>
      )}
      sliderWidth={width}
      itemWidth={width - 40}
      autoplay
      loop
      autoplayInterval={3000} // Thời gian chuyển ảnh (3 giây)
      enableMomentum={false}  // Ngăn trượt quá nhanh
      lockScrollWhileSnapping  // Dừng đúng vị trí banner
      inactiveSlideScale={0.9} // Làm nhỏ các banner không được chọn
      inactiveSlideOpacity={0.7} // Làm mờ banner không được chọn
    />
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  author: {
    color: '#ddd',
    fontSize: 14,
  },
});
