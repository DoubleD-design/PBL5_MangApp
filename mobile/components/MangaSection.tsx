import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'react-native-feather';
import { useNavigation } from '@react-navigation/native';
import mangaService from '../services/mangaService';
import { Manga } from '../types/Manga';
import { Category } from '../types/Manga';
import categories from '../data/categories';

const MangaSection: React.FC<{ title: string }> = ({ title }) => {
  const [data, setData] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTopMangas = async () => {
      try {
        let data;
        switch (title) {
          case 'Most views':
            data = await mangaService.getMostViewedMangas(10);
            break;
          case 'Latest update':
            data = await mangaService.getLatestUpdates().then((res) => res.content);
            break;
          case 'All mangas':
            data = await mangaService.getAllMangas(0, 10).then((res) => res.content);
            break;
          default:
            data = [];
        }
        const formattedData = data.map((manga: Manga) => ({
          id: manga.id,
          title: manga.title,
          author: manga.author,
          status: manga.status,
          categories: manga.categories,
          subtitle: `${manga.views.toLocaleString()} views`,
          description: manga.description || `By ${manga.author}`,
          image: manga.coverImage,
          views: manga.views,
          coverImage: manga.coverImage,
          chapters: manga.chapters,
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching top mangas:", error);
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
  <TouchableOpacity
    style={styles.mangaItem}
    onPress={() => navigation.navigate('MangaDetail', { manga: item })}
  >
    <View style={styles.imageWrapper}>
      <ImageBackground
        source={{ uri: item.coverImage }}
        style={styles.imageBackground}
      />
    </View>
    <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
      {item.title}
    </Text>
    <Text style={styles.subtitle}>{item.subtitle}</Text>
  </TouchableOpacity>
);

  return (
    <View style={styles.container}>
      {/* Section Title and Navigation Button */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          onPress={() => {
            if (title === 'Latest update') {
              navigation.navigate('UpdateList', { title, data });
            } else if (title === 'All mangas') {
              navigation.navigate('MangaList', { title, data });
            } else if (title === 'Most views') {
              navigation.navigate('MostViewsList', { title, data });
            } 
          }}
        >
          <Text style={styles.seeMoreText}>See more {'>>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Manga List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />

      {/* Navigation buttons for flatlist scroll */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    marginTop: 5,
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
  mangaItem: {
  width: 120,
  marginHorizontal: 10,
},
imageWrapper: {
  width: '100%',
  aspectRatio: 0.75, // hoặc đặt chiều cao cố định
  borderRadius: 10,
  overflow: 'hidden',
  backgroundColor: '#000', // tránh nhấp nháy khi load ảnh
},
imageBackground: {
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},
  overlay: {
    position: 'absolute',
    top: '60%',
    left: 10,
    right: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#bbb',
  },
  navButtonLeft: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 30,
  },
  navButtonRight: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 30,
  },
});


export default MangaSection;
