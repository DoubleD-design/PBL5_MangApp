import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const mangaData = [
  { id: '1', title: 'Attack on Titan', chap: 'Chap 139', image: require('../assets/aot.jpg') },
  { id: '2', title: 'Oyasumi, Punpun', chap: 'Chap 147', image: require('../assets/punpun.jpg') },
  { id: '3', title: 'Jujutsu Kaisen', chap: 'Chap 253', image: require('../assets/jujutsu.jpg') }, // Thêm nhiều dữ liệu để test lướt ngang
  { id: '4', title: 'One Piece', chap: 'Chap 1108', image: require('../assets/onepiece.jpg') },
];

export default function MangaList({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <FlatList
        horizontal
        data={mangaData}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.text}>{item.title}</Text>
            <Text style={styles.text}>{item.chap}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }} // Giúp có khoảng trống ở cuối
        pagingEnabled={false} // Giữ cuộn mượt mà không bị snap vào item
        scrollEventThrottle={16} // Tăng hiệu suất cuộn
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  header: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  card: { margin: 10, width: 120 },
  image: { width: '100%', height: 160, borderRadius: 8 },
  text: { color: '#fff', fontSize: 14, textAlign: 'center' },
});
