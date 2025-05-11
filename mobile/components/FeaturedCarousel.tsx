import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { ChevronLeft, ChevronRight } from 'react-native-feather';
import { useNavigation } from '@react-navigation/native';
import mangaService from '../services/mangaService';
import { Manga } from '../types/Manga';

const FeaturedCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredMangas, setFeaturedMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTopMangas = async () => {
      try {
        const data = await mangaService.getMostViewedMangas(5);
        const formattedData = data.map((manga: any) => ({
          id: manga.id,
          title: manga.title,
          author: manga.author,
          subtitle: `${manga.views.toLocaleString()} views`,
          description: manga.description || `By ${manga.author}`,
          image: manga.coverImage,
          views: manga.views,
          coverImage: manga.coverImage,
          createAt: manga.createAt,
          status: manga.status,
        }));
        setFeaturedMangas(formattedData);
      } catch (error) {
        console.error("Error fetching top mangas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMangas();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMangas.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMangas.length) % featuredMangas.length);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff6740" />
      </View>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      {featuredMangas.length > 0 && (
        <ImageBackground
          source={{ uri: featuredMangas[currentSlide].image }}
          style={styles.imageBackground}
          imageStyle={styles.image}
        >
          <View style={styles.overlay}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{featuredMangas[currentSlide].title}</Text>
            <View style={styles.subtitle}>
              <Text style={styles.author}>
                {featuredMangas[currentSlide].author.length > 30 
                  ? featuredMangas[currentSlide].author.slice(0, 30) + "..." 
                  : featuredMangas[currentSlide].author}
              </Text>
              <Text style={styles.view}>{featuredMangas[currentSlide].subtitle}</Text>
            </View>
            
            
            {/* <Text style={styles.description}>{featuredMangas[currentSlide].description}</Text> */}
          </View>
        </ImageBackground>
      )}

      <TouchableOpacity onPress={prevSlide} style={styles.navButtonLeft}>
        <ChevronLeft width={20} height={20} stroke="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={nextSlide} style={styles.navButtonRight}>
        <ChevronRight width={20} height={20} stroke="#fff" />
      </TouchableOpacity>
      <View style={styles.indicatorContainer}>
        {featuredMangas.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              currentSlide === index && { backgroundColor: '#ff6740' },
            ]}
            onPress={() => setCurrentSlide(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    opacity: 0.5,
  },
  overlay: {
    position: 'absolute',
    top: '60%',
    left: 20,
    right: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold'
  },
  author: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  view: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff6740',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  },
  navButtonLeft: {
    position: 'absolute',
    left: 5,
    top: '50%',
    transform: [{ translateY: -15 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 30,
  },
  navButtonRight: {
    position: 'absolute',
    right: 5,
    top: '50%',
    transform: [{ translateY: -15 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 30,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -50 }],
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default FeaturedCarousel;
