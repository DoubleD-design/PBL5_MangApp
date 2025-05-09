import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { ChevronLeft, ChevronRight } from 'react-native-feather'; // Cài đặt thư viện icon
import { useNavigation } from '@react-navigation/native';
import mangaService from '../services/mangaService';

const FeaturedCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredMangas, setFeaturedMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTopMangas = async () => {
      try {
        const data = await mangaService.getMostViewedMangas(5);
        const formattedData = data.map((manga: any) => ({
          id: manga.id,
          title: manga.title,
          subtitle: `${manga.views.toLocaleString()} views`,
          description: manga.description || `By ${manga.author}`,
          image: manga.coverImage,
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
            <Text style={styles.title}>{featuredMangas[currentSlide].title}</Text>
            <Text style={styles.subtitle}>{featuredMangas[currentSlide].subtitle}</Text>
            <Text style={styles.description}>{featuredMangas[currentSlide].description}</Text>
          </View>
        </ImageBackground>
      )}

      <TouchableOpacity onPress={prevSlide} style={styles.navButtonLeft}>
        <ChevronLeft width={30} height={30} stroke="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={nextSlide} style={styles.navButtonRight}>
        <ChevronRight width={30} height={30} stroke="#fff" />
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
    height: 300,
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
    top: '50%',
    left: 20,
    right: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#ff6740',
  },
  description: {
    fontSize: 16,
    color: '#fff',
  },
  navButtonLeft: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -15 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 30,
  },
  navButtonRight: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -15 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 30,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 20,
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
