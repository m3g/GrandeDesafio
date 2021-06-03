import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import PhotoScreen from '../pages/photos/PhotoScreen'

const Stack = createStackNavigator()

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='PhotoScreen' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='PhotoScreen' component={PhotoScreen}></Stack.Screen>
      {/* <Stack.Screen name='PhotoConfirmationScreen' component={}></Stack.Screen>
      <Stack.Screen name='TrashTypeScreen' component={}></Stack.Screen>
      <Stack.Screen name='VolumeScreen' component={}></Stack.Screen>
      <Stack.Screen name='DataConfirmationScreen' component={}></Stack.Screen>
      <Stack.Screen name='ThankY ouScreen' component={}></Stack.Screen> */}
    </Stack.Navigator>
  )
}

export default StackNavigator
