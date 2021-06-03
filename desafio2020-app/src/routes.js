import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import HomeScreen from './pages/HomeScreen'
import StepZero from './pages/register/StepZero'
import StepOne from './pages/register/StepOne'
import StepTwo from './pages/register/StepTwo'
import StepThree from './pages/register/StepThree'
import RegisterSuccessfully from './pages/register/RegisterSuccessfully'
import BottomTab from './components/BottomTab'
import TrashTypeScreen from './pages/photos/TrashTypeScreen'

const Stack = createStackNavigator()

export default function Routes () {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={HomeScreen}></Stack.Screen>
        <Stack.Screen name='StepZero' component={StepZero}></Stack.Screen>
        <Stack.Screen name='StepOne' component={StepOne}></Stack.Screen>
        <Stack.Screen name='StepTwo' component={StepTwo}></Stack.Screen>
        <Stack.Screen name='StepThree' component={StepThree}></Stack.Screen>
        <Stack.Screen name='RegisterSuccessfully' component={RegisterSuccessfully}></Stack.Screen>
        <Stack.Screen name='BottomTab' component={BottomTab}></Stack.Screen>
        <Stack.Screen name='Trash' component={TrashTypeScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
