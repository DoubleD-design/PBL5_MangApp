import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import mangaService from '../services/mangaService';
import { Manga } from '../types/Manga';
import MangaCard from './MangaCard'; // Đảm bảo đường dẫn đúng
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

const MangaSection: React.FC<{ title: string }> = ({ title }) => {
  const [data, setData] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTopMangas = async () => {
      try {
        let data;
        switch (title) {
          case 'Most Views':
            data = await mangaService.getMostViewedMangas(10);
            break;
          case 'Latest Update':
            data = await mangaService.getLatestUpdates().then((res) => res.content);
            break;
          case 'All Mangas':
            data = await mangaService.getAllMangas(0, 10).then((res) => res.content);
            break;
          default:
            data = [];
        }

        const formattedData = data.map((manga: Manga) => ({
          ...manga,
          subtitle: `${manga.views.toLocaleString()} views`,
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching top mangas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMangas();
  }, [title]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff6740" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Manga }) => (
    <MangaCard
      manga={item}
      onPress={() => navigation.navigate('MangaDetail', { manga: item })}
    />
  );

  return (
    <View style={styles.container}>
      {/* Section title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MangaList', { title, data });
          }}
        >
          <Text style={styles.seeMoreText}>See more {'>>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Manga horizontal list */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    position: 'relative',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeMoreText: {
    color: '#bbb',
  },
  flatListContainer: {
    paddingHorizontal: 1,
    marginTop: 5,
  },
});

export default MangaSection;
