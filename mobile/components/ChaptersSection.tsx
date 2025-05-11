import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Manga, Chapter, Page } from '../types/Manga';

interface ChaptersSectionProps {
  mangaId: number; // Đảm bảo mangaId là number
}

const ChaptersSection: React.FC<ChaptersSectionProps> = ({ mangaId }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Giả sử API trả về danh sách các chapter theo mangaId
    const fetchChapters = async () => {
      try {
        const response = await fetch(`https://api.example.com/manga/${mangaId}/chapters`);
        const data = await response.json();
        setChapters(data); // Giả sử API trả về array của các chapter
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [mangaId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading Chapters...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chapters</Text>
      <View style={styles.chapterBox}>
        <ScrollView nestedScrollEnabled={true}>
          {chapters.map((chapter, index) => (
            <TouchableOpacity key={index} style={styles.chapterRow}>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    marginHorizontal: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  chapterBox: {
    backgroundColor: 'rgba(59, 42, 26, 0.7)',
    borderColor: '#b5e745',
    borderWidth: 1,
    borderRadius: 15,
    padding: 5,
    maxHeight: 400,
  },
  chapterRow: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomColor: 'rgba(181, 231, 69, 0.3)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center', // căn giữa nội dung theo chiều ngang
    alignItems: 'center',    
  },
  chapterTitle: {
    color: '#fff',
    fontSize: 15,
  },
  chapterDate: {
    color: 'white',
    fontSize: 14,
  },
})

export default ChaptersSection;
