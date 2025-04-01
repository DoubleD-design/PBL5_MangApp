import { View, ScrollView, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';
import BannerSlider from '../components/BannerSlider';
import MangaList from '../components/MangaLists';
import BottomNav from '../components/BottomNav';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <SearchBar />
      <ScrollView>
        <BannerSlider />
        <MangaList title="Lượt đọc nhiều" />
        <MangaList title="Được yêu thích" />
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
});
