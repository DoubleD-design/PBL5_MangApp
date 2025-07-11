import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/RootStackParamList';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { GRADIENTS } from '../../utils/const';
import { LinearGradient } from 'expo-linear-gradient';
import { Chapter, Manga } from '../../types/Manga';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../../services/api';
import CommentSection from '../CommentSection';
import favoriteService from '../../services/favoriteService';
import { useFocusEffect } from '@react-navigation/native';
import mangaService from '../../services/mangaService';
import  StarRating from 'react-native-star-rating-widget';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
type MangaDetailRouteProp = RouteProp<RootStackParamList, 'MangaDetail'>;

const { height } = Dimensions.get('window');

const MangaDetailScreen = () => {
  const route = useRoute<MangaDetailRouteProp>();
  const { manga } = route.params;
  const navigation = useNavigation<RootStackNavigationProp>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mangaInfor, setMangaInfor] = useState<Manga>(manga);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [mangaRes, chapterRes, favorites, userRatingRes, mangaRatingsRes, avgRatingRes] = await Promise.all([
            api.get(`/manga/${manga.id}`),
            api.get(`/chapters/manga/${manga.id}`),
            favoriteService.getUserFavorites(),
            mangaService.getUserRating(manga.id),
            mangaService.getMangaRatings(manga.id),
            mangaService.getAverageRating(manga.id),
          ]);

          setMangaInfor(mangaRes.data);
          setChapters(chapterRes.data);
          setUserRating(userRatingRes);
          setRatingCount(mangaRatingsRes.length);
          setAverageRating(avgRatingRes);
          const token = await AsyncStorage.getItem('token');
          if (token) {
            const isFav = favorites.some((fav) => String(fav.id) === String(manga.id));
            setIsFavorite(isFav);
          }
          else {
            setIsFavorite(false);
          }
          
        } catch (error) {
          console.error('Error loading manga detail:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [manga.id])
  );

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      navigation.navigate('Login');
      return false;
    }
    return true;
  };

  const toggleFavorite = async () => {
    const isLoggedIn = await checkLogin();
    if (!isLoggedIn) return;
    try {
      if (isFavorite) {
        await favoriteService.removeFromFavorites(mangaInfor.id);
        setIsFavorite(false);
      } else {
        await favoriteService.addToFavorites(mangaInfor.id);
        setIsFavorite(true);
      }
    } catch (error) {
      alert('Failed to update favorite status');
      console.error(error);
    }
  };

  const handleRatingChange = async (rating: number) => {
    const isLoggedIn = await checkLogin();
    if (!isLoggedIn) return;
    setUserRating(rating);

    try {
      await await mangaService.rateManga(manga.id, rating);

      const [avg, all] = await Promise.all([
        mangaService.getAverageRating(manga.id),
        mangaService.getMangaRatings(manga.id),
      ]);
      setAverageRating(avg);
      setRatingCount(all.length);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <LinearGradient {...GRADIENTS.BACKGROUND} style={styles.gradient}>
      <ImageBackground
        source={{ uri: mangaInfor.coverImage }}
        style={[StyleSheet.absoluteFillObject, { backgroundColor: '#2c1a0e' }]}
        imageStyle={{ resizeMode: 'cover', opacity: 0.2 }}
      />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.mangaTitle}>{mangaInfor.title}</Text>
        </View>
        <View style={{ position: 'relative', marginTop: 20 }}>
          <ImageBackground
            source={{ uri: mangaInfor.coverImage }}
            style={styles.mangaImage}
            imageStyle={{ borderRadius: 10 }}
          />
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              mangaService.incrementViews(mangaInfor.id);
              if (chapters.length > 0) {
                navigation.navigate('Reading', { chapter: chapters[0], chapters });
              } else {
                alert('No chapters available.');
              }
            }}
          >
            <Text style={styles.startButtonText}>Start Reading</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.likeButton}
            onPress={toggleFavorite}
          >
            <Ionicons name="heart" size={24} color={isFavorite ? 'rgba(228, 84, 36, 0.96)' : 'rgba(66, 57, 55, 0.96)'} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 5 }}>
          <View style={styles.infoTable}>
            <View>
              <Text style={styles.infoValue}>{mangaInfor.description}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: '#b5e745', marginVertical: 20, opacity: 0.3 }} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Author</Text>
              <Text style={styles.infoValue}>{mangaInfor.author}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categories</Text>
              <Text style={styles.infoValue}>
                {Array.isArray(mangaInfor.categories)
                  ? mangaInfor.categories.map(c => c.name).join(', ')
                  : 'Unknown'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{mangaInfor.status}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Views</Text>
              <Text style={styles.infoValue}>{mangaInfor.views}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Average Rating</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <StarRating
                  rating={Math.round(averageRating *2) / 2}
                  maxStars={5}
                  starSize={20}
                  enableHalfStar={true}
                  starStyle={{ marginHorizontal: 2 }}
                  animationConfig={{ scale: 1 }}
                  onChange={() => {}}
                />
                <Text style={styles.infoValue}>
                  {averageRating.toFixed(1)}/5
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Your Rating</Text>
              <View style={{ flex: 1 }}>
                <StarRating
                  rating={userRating || 0}
                  onChange={handleRatingChange}
                  maxStars={5}
                  starSize={20}
                  enableHalfStar={false}
                  starStyle={{ marginHorizontal: 2 }}
                  animationConfig={{ scale: 1 }}
                />
              </View>
            </View>
            {/* <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Ratings</Text>
              <Text style={styles.infoValue}>{ratingCount}</Text>
            </View> */}
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
                      onPress={() => {
                        mangaService.incrementViews(mangaInfor.id);
                        navigation.navigate('Reading', { chapter, chapters })}}
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
        <View>
          <CommentSection mangaId={mangaInfor.id} />
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
    paddingBottom: 10,
    height: height,
  },
  backButton: {
    position: 'absolute',
    top: 30,
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
    backgroundColor: 'rgba(255, 255, 255, 0.73)',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
