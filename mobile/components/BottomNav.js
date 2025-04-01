import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, List, Users, History, Heart, User } from 'lucide-react-native';

export default function BottomNav() {
  return (
    <View style={styles.container}>
      {navItems.map((item, index) => (
        <TouchableOpacity key={index} activeOpacity={0.7} onPress={() => console.log(item.name)}>
          <item.icon color="#fff" size={28} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const navItems = [
  { name: 'Home', icon: Home },
  { name: 'List', icon: List },
  { name: 'Users', icon: Users },
  { name: 'History', icon: History },
  { name: 'Heart', icon: Heart },
  { name: 'User', icon: User },
];

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1e1e1e',
    paddingVertical: 10,
    elevation: 5, // Thêm shadow trên Android
  },
});
