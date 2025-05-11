import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/RootStackParamList';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { GRADIENTS } from '../../utils/const';
import { LinearGradient } from 'expo-linear-gradient';
import { Chapter } from '../../types/Manga';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../../services/api';

type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

type MangaDetailRouteProp = RouteProp<RootStackParamList, 'MangaDetail'>;

const { height } = Dimensions.get('window'); // Lấy chiều cao màn hình

const MangaDetailScreen = () => {
  const route = useRoute<MangaDetailRouteProp>();
  const { manga } = route.params;
  const navigation = useNavigation<RootStackNavigationProp>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await api.get(`/chapters/manga/${manga.id}`);
        setChapters(response.data);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [manga.id]);

  return (
    <LinearGradient {...GRADIENTS.BACKGROUND} style={styles.gradient}>
      <ImageBackground
        source={{ uri: manga.coverImage }}
        style={[StyleSheet.absoluteFillObject, { backgroundColor: '#2c1a0e' }, { marginTop: 50 }]}
        imageStyle={{ resizeMode: 'cover', opacity: 0.2 }}
      />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.mangaTitle}>{manga.title}</Text>
        </View>
        <View style={{ position: 'relative', marginTop: 20 }}>
          <ImageBackground
            source={{ uri: manga.coverImage }}
            style={styles.mangaImage}
            imageStyle={{ borderRadius: 10 }}
          />
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              if (chapters.length > 0) {
                navigation.navigate('Reading', { chapter: chapters[0], chapters: chapters });
              } else {
                alert('No chapters available.');
              }
            }}
          >
            <Text style={styles.startButtonText}>Start Reading</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => alert('you liked this manga')}
          >
            <Ionicons name="heart" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 5 }}>
          <View style={styles.infoTable}>
            <View>
              <Text style={styles.infoValue}>{manga.description}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: '#b5e745', marginVertical: 20, opacity: 0.3 }} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Author</Text>
              <Text style={styles.infoValue}>{manga.author}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categories</Text>
              <Text style={styles.infoValue}>
                {Array.isArray(manga.categories)
                  ? manga.categories.map(c => c.name).join(', ')
                  : 'Unknown'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{manga.status}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Views</Text>
              <Text style={styles.infoValue}>{manga.views}</Text>
            </View>
          </View>
        </View>

        <View style={styles.chapterListContainer}>
          <Text style={styles.chapterListTitle}>Chapters</Text>
          <View style={styles.chapterBox}>
            {loading ? (
              <Text style={{ color: '#ccc', paddingVertical: 10 }}>Loading...</Text>
            ) : (
              <ScrollView nestedScrollEnabled={true}>
                {chapters.length > 0 ? (
                  chapters.slice().reverse().map((chapter, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.chapterRow}
                      onPress={() => navigation.navigate('Reading', { chapter, chapters })}
                    >
                      <Text style={styles.chapterTitle}>{chapter.title}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={{ color: '#ccc', paddingVertical: 10 }}>No chapters available.</Text>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    flex: 1,
    marginTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    zIndex: 10,
  },
  mangaImage: {
    width: 200,
    height: 300,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 50,
  },
  mangaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b5e745',
    textAlign: 'center',
    marginHorizontal: 10,
    top: 55,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  likeButton: {
    alignSelf: 'center',
    backgroundColor: 'rgba(39, 148, 70, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 15,
  },
  startButton: {
    alignSelf: 'center',
    backgroundColor: 'rgb(225, 90, 69)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 15,
  },
  startButtonText: {
    color: 'rgb(255, 255, 255)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoTable: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(59, 42, 26, 0.7)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b5e745',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#fff',
    fontSize: 15,
    width: 100,
  },
  infoValue: {
    color: '#c8c8c8',
    fontSize: 15,
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'justify',
  },
  gradient: {
    flex: 1, // Chiếm toàn bộ màn hình
    justifyContent: 'center', // Canh giữa theo chiều dọc
    alignItems: 'center', // Canh giữa theo chiều ngang
  },
  chapterListContainer: {
    marginHorizontal: 10,
    marginBottom: 30,
  },
  chapterListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b5e745',
    marginBottom: 10,
    marginLeft: 10,
  },
  chapterBox: {
    backgroundColor: 'rgba(59, 42, 26, 0.7)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#b5e745',
    maxHeight: 250,
  },
  chapterRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  chapterTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MangaDetailScreen;
