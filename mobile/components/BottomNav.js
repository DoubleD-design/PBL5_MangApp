import { View, TouchableOpacity } from 'react-native';
import { Home, List, Users, History, Heart, User } from 'lucide-react-native';

export default function BottomNav() {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#1e1e1e', paddingVertical: 10 }}>
      <TouchableOpacity>
        <Home color="#fff" size={28} />
      </TouchableOpacity>
      <TouchableOpacity>
        <List color="#fff" size={28} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Users color="#fff" size={28} />
      </TouchableOpacity>
      <TouchableOpacity>
        <History color="#fff" size={28} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Heart color="#fff" size={28} />
      </TouchableOpacity>
      <TouchableOpacity>
        <User color="#fff" size={28} />
      </TouchableOpacity>
    </View>
  );
}
