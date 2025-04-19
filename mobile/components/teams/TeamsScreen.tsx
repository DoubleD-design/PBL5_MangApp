import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Dummy data cho nhóm đăng truyện
const dummyGroups = Array(6).fill({
  name: 'Bắc Lệ Thần Xà',
  uploads: '51',
  cover: 'https://i.imgur.com/8Km9tLL.png',
  views: '117K',
});

// Dummy data cho top tháng
const topUsers = [
  {
    id: '1',
    name: 'Senukin',
    uploads: '30',
    views: '88k',
    avatar: 'https://i.imgur.com/UPrs1EW.png',
    rank: 1,
    color: '#facc15', // vàng
  },
  {
    id: '2',
    name: 'Yukino',
    uploads: '38',
    views: '97k',
    avatar: 'https://i.imgur.com/8Km9tLL.png',
    rank: 2,
    color: '#a3a3a3', // bạc
  },
  {
    id: '3',
    name: 'Minato',
    uploads: '45',
    views: '102k',
    avatar: 'https://i.imgur.com/GKskz5A.png',
    rank: 3,
    color: '#cd7f32', // đồng
  },
];

// Carousel component
const TopCardCarousel = () => (
  <FlatList
    horizontal
    data={topUsers}
    keyExtractor={(item) => item.id}
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
    renderItem={({ item }) => (
      <View style={[styles.topCard, { backgroundColor: item.color }]}>
        <Image source={{ uri: item.avatar }} style={styles.topImage} />
        <View style={styles.topOverlay}>
          <Text style={styles.topRank}>{item.rank}</Text>
          <View style={styles.topInfo}>
            <Text style={styles.topName}>{item.name}</Text>
            <Text style={styles.topStat}>
              <Text><FontAwesome name="bar-chart" /> {item.uploads}</Text>
              <Text> mangas</Text>
            </Text>
            <Text style={styles.topStat}>
                <Text>{item.views}</Text>
                <Text> views</Text>
            </Text>
          </View>
        </View>
      </View>
    )}
  />
);

const TeamsScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#2b1e14' }}>
      {/* Search bar (không đụng tới) */}
      <View
        style={{
          marginTop: 50,
          marginHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#333',
          borderRadius: 10,
          paddingHorizontal: 10,
          height: 40,
        }}
      >
        <TextInput
          placeholder="Searching..."
          placeholderTextColor="#aaa"
          style={{ flex: 1, color: '#fff' }}
        />
      </View>

      {/* TOP THÁNG Carousel */}
      <Text style={styles.sectionTitle}>★ Monthly Ranking</Text>
      <TopCardCarousel />

      {/* Các nhóm đăng truyện */}
      <Text style={styles.sectionTitle}>Other translators</Text>
      <FlatList
        data={dummyGroups}
        numColumns={2}
        keyExtractor={(_, i) => i.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View style={styles.groupCard}>
            <Image source={{ uri: item.cover }} style={styles.groupImage} />
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupStat}>
              <FontAwesome name="bar-chart" /> {item.uploads} mangas
            </Text>
            <Text style={styles.groupStat}>{item.views} views</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  topCard: {
    width: 260,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
  },
  topImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  topOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topRank: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: '#00000088',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  topInfo: {
    alignItems: 'flex-end',
  },
  topName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topStat: {
    color: '#fff',
    fontSize: 12,
  },
  groupCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    padding: 10,
  },
  groupImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  groupName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupStat: {
    fontSize: 12,
    color: '#555',
  },
});

export default TeamsScreen;
