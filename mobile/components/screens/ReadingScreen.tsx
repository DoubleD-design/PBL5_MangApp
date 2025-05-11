import React, { useState, useEffect } from 'react';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/RootStackParamList';
import {
  View, Text, ScrollView, Image, StyleSheet, TouchableOpacity,
  Dimensions, Modal, FlatList, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { Page } from '../../types/Manga';
import axios from 'axios';
import api from '../../services/api';

type ReadingRouteProp = RouteProp<RootStackParamList, 'Reading'>;

const ReadingScreen = () => {
  const route = useRoute<ReadingRouteProp>();
  type ReadingNavigationProp = StackNavigationProp<RootStackParamList, 'Reading'>;
  const navigation = useNavigation<ReadingNavigationProp>();
  const { chapter, chapters } = route.params;
  const { width } = Dimensions.get('window');

  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChapterList, setShowChapterList] = useState(false);
  const [imageHeights, setImageHeights] = useState<{ [key: string]: number }>({});

  const currentIndex = chapters.findIndex((c) => c.id === chapter.id);

  const goToChapter = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < chapters.length) {
      navigation.navigate('Reading', {
        chapter: chapters[targetIndex],
        chapters,
      });
    }
  };

  useEffect(() => {
  setLoading(true);
  setPages([]);
  setImageHeights({});
  api.get(`/chapters/${chapter.id}/pages`).then((response) => {
      setPages(
        response.data.sort((a: Page, b: Page) => a.pageNumber - b.pageNumber)
      );
      setLoading(false);
    })
    .catch((error) => {
      console.error('Lỗi khi fetch pages:', error);
      setLoading(false);
    });
}, [chapter]);

  useEffect(() => {
    pages.forEach((page) => {
      if (!imageHeights[page.id]) {
        Image.getSize(
          page.imageUrl,
          (originalWidth, originalHeight) => {
            const scaledHeight = (width / originalWidth) * originalHeight;
            setImageHeights(prev => ({ ...prev, [page.id]: scaledHeight }));
          },
          (error) => {
            console.warn('Lỗi tải ảnh:', error);
          }
        );
      }
    });
  }, [pages, width]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <Text style={styles.chapterTitle} numberOfLines={1} ellipsizeMode="tail">
        {chapter.title.length > 25 ? chapter.title.slice(0, 25) + '...' : chapter.title}
      </Text>

      

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#b5e745" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.imageList}>
          {pages.map((page) => (
            <Image
              key={page.id}
              source={{ uri: page.imageUrl }}
              style={{
                width: width,
                height: imageHeights[page.id] || width * 1.4,
                marginBottom: 10,
                alignSelf: 'center',
              }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.navButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && { opacity: 0.5 }]}
          onPress={() => goToChapter(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <Ionicons name="chevron-back" size={24} color="#b5e745" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButtonModal}
          onPress={() => setShowChapterList(true)}
        >
          <Text style={styles.navButtonText} numberOfLines={1} ellipsizeMode="tail">
            {chapter.title}
          </Text>
          <Ionicons name="chevron-up" size={18} color="#b5e745" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, currentIndex === chapters.length - 1 && { opacity: 0.5 }]}
          onPress={() => goToChapter(currentIndex + 1)}
          disabled={currentIndex === chapters.length - 1}
        >
          <Ionicons name="chevron-forward" size={24} color="#b5e745" />
        </TouchableOpacity>
      </View>

      <Modal visible={showChapterList} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chapters List</Text>
            <FlatList
              data={chapters.slice().reverse()}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.chapterItem}
                  onPress={() => {
                    setShowChapterList(false);
                    navigation.navigate('Reading', { chapter: item, chapters });
                  }}
                >
                  <Text style={styles.chapterItemText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowChapterList(false)} style={styles.closeButton}>
              <Text style={styles.navButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1a1a1a' },
  backButton: { position: 'absolute', top: 70, left: 20, zIndex: 10 },
  chapterTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#b5e745', textAlign: 'center',
    marginTop: 70, marginBottom: 10,
  },
  imageList: { paddingBottom: 20 },
  navButtons: {
    flexDirection: 'row', justifyContent: 'center',
    marginVertical: 10, paddingHorizontal: 10,
  },
  navButton: {
    backgroundColor: '#3a3a3a',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  navButtonModal: {
    backgroundColor: '#3a3a3a',
    width: 200,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
  navButtonText: {
    color: '#b5e745',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#2c2c2c',
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#b5e745',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chapterItem: {
    paddingVertical: 10,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  chapterItemText: { color: '#fff', fontSize: 16 },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#444',
    borderRadius: 8,
  },
});

export default ReadingScreen;
