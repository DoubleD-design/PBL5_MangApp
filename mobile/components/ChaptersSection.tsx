import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { RootStackParamList } from '../types/RootStackParamList';
import { Chapter } from '../types/Manga';
import api from '../services/api';

type ChaptersSectionProps = {
  mangaId: number;
};

type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;

const ChaptersSection: React.FC<ChaptersSectionProps> = ({ mangaId }) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await api.get(`/chapters/manga/${mangaId}`);
        setChapters(response.data);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [mangaId]);

  return (
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
  );
};

const styles = StyleSheet.create({
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

export default ChaptersSection;
