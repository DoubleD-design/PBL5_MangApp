import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Manga } from '../../types/Manga';
import MangaCard from '../MangaCard';
import SearchBar from '../SearchBar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '../../utils/const';

const screenWidth = Dimensions.get('window').width;
const ITEM_WIDTH = screenWidth / 3 - 2;

type SearchResultsRouteProp = RouteProp<
  {
    SearchResults: {
      query: string;
      results: Manga[];
    };
  },
  'SearchResults'
>;

const SearchResultsScreen: React.FC = () => {
  const route = useRoute<SearchResultsRouteProp>();
  const navigation = useNavigation();
  const initialQuery = route.params?.query || '';
  const initialResults = route.params?.results || [];

  const [data, setData] = useState<Manga[]>(initialResults);
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 21;

  const handleSearchResults = (results: Manga[]) => {
    setData(results);
    setCurrentPage(1);
    setLoading(false);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderItem = ({ item }: { item: Manga }) => (
    <View style={{ width: ITEM_WIDTH, marginBottom: 7 }}>
      <MangaCard manga={item} />
    </View>
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <LinearGradient {...GRADIENTS.BACKGROUND} style={styles.gradient}>
    <View style={styles.container}>
      
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Search Results</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ff6740" style={{ marginTop: 20 }} />
      ) : (
        <>
          <FlatList
            data={paginatedData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            contentContainerStyle={styles.list}
          />

          {/* Pagination */}
          {data.length > 0 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Text style={[styles.pageButton, currentPage === 1 && styles.disabled]}>
                  {'< Prev'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.pageNumber}>Page {currentPage} / {totalPages}</Text>

              <TouchableOpacity
                onPress={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Text
                  style={[styles.pageButton, currentPage === totalPages && styles.disabled]}
                >
                  {'Next >'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c1a0e',
  },
  backButton: {
    position: 'absolute',
    top: 72,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 70,
  },
  list: {
    paddingBottom: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  pageButton: {
    fontSize: 16,
    color: '#ff6740',
    paddingHorizontal: 10,
  },
  disabled: {
    color: '#555',
  },
  pageNumber: {
    fontSize: 16,
    color: '#fff',
  },
  gradient: {
    flex: 1, // Chiếm toàn bộ màn hình
  }
});

export default SearchResultsScreen;
