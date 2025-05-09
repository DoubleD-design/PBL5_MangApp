import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MangaDetailScreen = () => {
  const chapters = Array.from({ length: 17 }, (_, i) => 139 - i);

const mangaInfor = [
    {
        id: '',
        name: '',
        
    }
]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/attack-on-titan.jpg')} style={styles.cover} />
        <View style={styles.headerContent}>
          <Text style={styles.title}>Attack on Titan</Text>
          <Text style={styles.description}>
            Attack on Titan lấy bối cảnh nhân loại sống trong ba bức tường để tránh bị Titan ăn thịt...
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>139/139</Text>
            <Text style={styles.infoText}>2013</Text>
            <Text style={styles.infoText}>Hajime Isayama</Text>
          </View>

          <View style={styles.iconRow}>
            <Ionicons name="eye" size={16} color="#fff" />
            <Text style={styles.iconText}>7,640,471 lượt xem</Text>
            <Ionicons name="heart" size={16} color="#fff" style={{ marginLeft: 12 }} />
            <Text style={styles.iconText}>7,554 lượt theo dõi</Text>
          </View>

          <Text style={styles.genre}>
            Thể loại: <Text style={styles.genreHighlight}>Shounen, Super Power, Fantasy, Drama, Action</Text>
          </Text>

          <TouchableOpacity style={styles.readButton}>
            <Text style={styles.readButtonText}>Đọc truyện</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.chapterHeader}>Danh sách chapter</Text>

      <View style={styles.chapterList}>
        {chapters.map((num) => (
          <TouchableOpacity key={num} style={styles.chapterItem}>
            <Text style={styles.chapterText}>Chapter {num}</Text>
            <Text style={styles.chapterDate}>21/12/2013</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default MangaDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c1a13',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    marginTop: 20,
  },
  cover: {
    width: 120,
    height: 170,
    borderRadius: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  description: {
    color: '#ddd',
    fontSize: 13,
    marginVertical: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  infoText: {
    color: '#ffa756',
    fontSize: 12,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  iconText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
  },
  genre: {
    marginTop: 6,
    fontSize: 12,
    color: '#fff',
  },
  genreHighlight: {
    color: '#ffa756',
  },
  readButton: {
    marginTop: 10,
    backgroundColor: '#ffa756',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    width: 100,
  },
  readButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chapterHeader: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
    fontWeight: 'bold',
  },
  chapterList: {
    marginTop: 10,
    marginBottom: 20,
  },
  chapterItem: {
    backgroundColor: '#4a2a1e',
    padding: 12,
    borderRadius: 10,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chapterText: {
    color: '#fff',
    fontSize: 14,
  },
  chapterDate: {
    color: '#ccc',
    fontSize: 12,
  },
});
