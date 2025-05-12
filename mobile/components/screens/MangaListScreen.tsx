import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import MangaCard from './../MangaCard';
import { Manga } from '../../types/Manga';
import api from '../../services/api';
import SearchBar from '../SearchBar';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '../../utils/const';

const screenWidth = Dimensions.get('window').width;
const ITEM_WIDTH = screenWidth / 3 - 2;

type MangaListRouteProp = RouteProp<
  {
    params: {
      title: string;
    };
  },
  'params'
>;

const MangaListScreen: React.FC = () => {
  const route = useRoute<MangaListRouteProp>();
  const { title } = route.params;

  const [data, setData] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 21;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = '';

        switch (title) {
          case 'All Mangas':
            url = '/manga?size=10000';
            break;
          case 'Latest Update':
            url = '/manga/latest?size=10000';
            break;
          case 'Most Views':
            url = '/manga/most-viewed?limit=10000';
            break;
          default:
            return;
        }

        const response = await api.get(url);
        const content = response.data?.content || response.data || [];
        setData(content);
      } catch (error) {
        console.error('Error fetching manga list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [title]);

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
    <View style={styles.container }>
      <SearchBar />
      <Text style={styles.title}>{title}</Text>

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 15,
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
    justifyContent: 'center', // Canh giữa theo chiều dọc
    alignItems: 'center', // Canh giữa theo chiều ngang
  }
});

export default MangaListScreen;
