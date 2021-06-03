import React from 'react'
import { View, Text, Button } from 'react-native'

export default function PhotoScren ({ navigation }) {
  return (
    <View>
      <Text>Photo</Text>
      <Button title='seguir' onPress={() => navigation.navigate('Trash')} />
    </View>
  )
}
