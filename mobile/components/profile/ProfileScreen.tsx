import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const userData = {
  id: '1',
  email: 'hieunguyenthanh2611@gmail.com',
  name: 'Nguyễn Thành Hiếu',
  username: 'nth2611',
  password: '26112004',
};

const ProfileScreen = () => {
  const [avatar, setAvatar] = useState('https://i.imgur.com/8Km9tLL.png');

  // Yêu cầu quyền khi mở app
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Ứng dụng cần quyền truy cập ảnh để thay đổi avatar!');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };
  
  
  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Account</Text>

      {/* Avatar + Tên */}
      <View style={styles.center}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.username}>{userData.username}</Text>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <ButtonSmall title="Change avatar" onPress={pickImage} />
        </View>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <InputIcon
          icon={<MaterialIcons name="email" size={20} color="#aaa" />}
          value={userData.email}
          editable={false}
        />
        <InputIcon
          icon={<FontAwesome name="user" size={20} color="#aaa" />}
          placeholder={userData.name}
        />
        <InputIcon
          icon={<FontAwesome name="user" size={20} color="#aaa" />}
          placeholder={userData.username}
        />
        <InputIcon
          icon={<FontAwesome name="lock" size={20} color="#aaa" />}
          placeholder="Để nguyên nếu không muốn đổi"
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>Save changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ButtonSmall = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.smallButton} onPress={onPress}>
    <Text style={styles.smallButtonText}>{title}</Text>
  </TouchableOpacity>
);

const InputIcon = ({
  icon,
  placeholder,
  value,
  editable = true,
  secureTextEntry = false,
}: {
  icon: React.ReactNode;
  placeholder?: string;
  value?: string;
  editable?: boolean;
  secureTextEntry?: boolean;
}) => (
  <View style={styles.inputWrapper}>
    {icon}
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#ccc"
      value={value}
      editable={editable}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  center: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#f97316',
    overflow: 'hidden',
    marginBottom: 8,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  smallButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    margin: 4,
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 13,
  },
  form: {
    gap: 16,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    marginLeft: 12,
  },
  saveButton: {
    backgroundColor: '#f97316',
    borderRadius: 999,
    paddingVertical: 14,
    marginTop: 24,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
