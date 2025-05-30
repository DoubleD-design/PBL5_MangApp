import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import api from '../services/api'
import { RootStackParamList } from '../types/RootStackParamList' // Đảm bảo đúng path

type NavigationProp = StackNavigationProp<RootStackParamList> // hoặc màn đang dùng CategoryModal

interface Category {
  id: number
  name: string
}

interface Props {
  visible: boolean
  onClose: () => void
}

export default function CategoryModal({ visible, onClose }: Props) {
  const [categories, setCategories] = useState<Category[]>([])
  const navigation = useNavigation<NavigationProp>()

  useEffect(() => {
    if (visible) {
      api
        .get('/categories')
        .then((res) => setCategories(res.data))
        .catch((err) => console.log('Error fetching categories:', err))
    }
  }, [visible])

  const handleCategoryPress = (category: Category) => {
    onClose()
    navigation.navigate('CategoryMangaList', {
      categoryId: category.id,
      title: category.name,
    })
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Categories</Text>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleCategoryPress(item)}>
                    <Text style={styles.item}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 10 }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#3a2a1f',
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 25,
    width: '85%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  item: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#5c4a3b',
  },
})
