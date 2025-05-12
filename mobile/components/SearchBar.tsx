import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { Manga, SearchRes } from '../types/Manga';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParamList';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SearchResults'>;

interface Props {
  placeholder?: string;
  onSearch?: (data: any) => void;
}

const SearchBar: React.FC<Props> = ({ placeholder = 'Searching...', onSearch }) => {
  const [query, setQuery] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const [searchRes, setSearchRes] = useState<SearchRes>();

  const handleSearch = async () => {
  if (!query.trim()) return;

  try {
    const response = await api.get('/manga/search', {
      params: {
        query: query,
        type: 'title',
        page: 0,
        size: 100,
      },
    });

    const results = response.data.content;
    navigation.navigate('SearchResults', {
      query,
      results, // truyền mảng manga trực tiếp
    });
  } catch (error: any) {
    Alert.alert('Search Error', error.message || 'Unknown error');
  }
};

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  input: {
    flex: 1,
    color: '#fff',
  },
});

export default SearchBar;
