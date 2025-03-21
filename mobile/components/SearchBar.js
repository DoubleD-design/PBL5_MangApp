import { View, TextInput, StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SearchBar() {
  const [searchText, setSearchText] = useState(""); // State lưu nội dung tìm kiếm
  const [showNotification, setShowNotification] = useState(false);
  const translateX = useRef(new Animated.Value(300)).current;

  const toggleNotification = () => {
    setShowNotification(!showNotification);
    Animated.timing(translateX, {
      toValue: showNotification ? 300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText} // Cập nhật state khi nhập
        />
        <TouchableOpacity onPress={toggleNotification}>
          <Icon name="bell" size={24} color="#ff6600" style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Hiển thị nội dung tìm kiếm (chỉ để kiểm tra) */}
      {searchText !== "" && (
        <Text style={{ color: '#fff', marginLeft: 10 }}>Bạn đang tìm: {searchText}</Text>
      )}

      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleNotification}>
        <Animated.View style={[styles.notificationBox, { transform: [{ translateX }] }]}>
          <Text style={{ color: '#000', fontSize: 16 }}>Thông báo sẽ hiển thị ở đây</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 5,
    color: '#000',
  },
  icon: {
    marginLeft: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  notificationBox: {
    position: 'absolute',
    top: 100,
    right: 10,
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});
