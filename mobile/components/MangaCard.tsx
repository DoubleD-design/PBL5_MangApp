import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Manga } from '../types/Manga';

interface MangaCardProps {
  manga: Manga;
}

const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('MangaDetail', { manga });
  };

  return (
    <TouchableOpacity style={styles.mangaItem} onPress={handlePress}>
      <View style={styles.imageWrapper}>
        <ImageBackground
          source={{ uri: manga.coverImage }}
          style={styles.imageBackground}
        />
      </View>
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {manga.title}
      </Text>
      <Text style={styles.subtitle}>{manga.subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mangaItem: {
    width: 120,
    marginHorizontal: 10,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 0.75,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#bbb',
    textAlign: 'center',
  },
});

export default MangaCard;
