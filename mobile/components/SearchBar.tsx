import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface Props {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar: React.FC<Props> = ({ placeholder = "Searching...", value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
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
