import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import userService from '../../services/userService'; // Cập nhật lại đường dẫn import nếu cần
import { FontAwesome5 } from '@expo/vector-icons';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [vipStatus, setVipStatus] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Ứng dụng cần quyền truy cập ảnh để thay đổi avatar!');
      }

      try {
        const data = await userService.getUserProfile();
        setProfile(data);

        if (data.avatar) {
          setAvatar(data.avatar);
        } else {
          setAvatar(null); // Không có ảnh
        }

        setUsername(data.username);
        setBirthday(data.birthday);
        setGender(data.gender);
        setVipStatus(data.vipStatus)
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng!');
      } finally {
        setLoading(false);
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
      const imageAsset = result.assets[0];
      setAvatar(imageAsset.uri);

      const formData = {
        uri: imageAsset.uri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      };

      try {
        await userService.updateAvatar(formData);
        Alert.alert('Thành công', 'Cập nhật avatar thành công!');
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể cập nhật avatar!');
      }
    }
  };

  const handleSave = async () => {
    try {
      await userService.editUserProfile({ birthday, gender, vipStatus });
      Alert.alert('Thành công', 'Đã lưu thay đổi!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu thay đổi!');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <View style={styles.center}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {username ? username[0].toUpperCase() : '?'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.usernameRow}>
          {vipStatus && (
            <FontAwesome5
              name="crown"
              size={18}
              color="#facc15"
              style={{ marginRight: 6 }}
            />
          )}
          <Text style={styles.username}>{profile.username}</Text>
        </View>

        <View style={styles.buttonRow}>
          <ButtonSmall title="Change avatar" onPress={pickImage} />
        </View>
      </View>

      <View style={styles.form}>
        <InputIcon
          icon={<FontAwesome name="user" size={20} color="#aaa" />}
          value={username}
          onChangeText={setUsername}
        />
        <InputIcon
          icon={<MaterialIcons name="email" size={20} color="#aaa" />}
          value={profile.email}
          editable={false}
        />
        <InputIcon
          icon={<FontAwesome name="calendar" size={20} color="#aaa" />}
          value={birthday}
          onChangeText={setBirthday}
        />
        <InputIcon
          icon={<FontAwesome name="mars" size={20} color="#aaa" />}
          value={gender}
          onChangeText={setGender}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save changes</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.vipButton}
        onPress={() => Alert.alert('You clicked me')}
      >
        <Text style={styles.vipText}>VIP Registration</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
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
  value,
  editable = true,
  onChangeText,
}: {
  icon: React.ReactNode;
  value?: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
}) => (
  <View style={styles.inputWrapper}>
    {icon}
    <TextInput
      style={styles.input}
      placeholderTextColor="#ccc"
      value={value}
      editable={editable}
      onChangeText={onChangeText}
    />
  </View>
);

const styles = StyleSheet.create({
usernameRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  marginBottom: 12,
},

vipButton: {
  backgroundColor: '#10b981', // màu xanh ngọc
  borderRadius: 999,
  paddingVertical: 14,
  marginTop: 12,
},
vipText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'center',
},
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bbb',
  },

  avatarInitial: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
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
  },
  buttonRow: {
    flexDirection: 'row',
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
  logoutButton: {
    backgroundColor: '#dc2626',
    borderRadius: 999,
    paddingVertical: 14,
    marginTop: 12,
    marginBottom: 24,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
