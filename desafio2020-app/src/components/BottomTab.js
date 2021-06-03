import React, { useState } from 'react'
import { Image, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import User from '../pages/User'
import RankingScreen from '../pages/RankingScreen'
import PhotoStack from '../stacks/PhotoStack'

import UserIcon from '../assets/user.png'
import UserSelectedIcon from '../assets/userSelected.png'
import PhotoIcon from '../assets/photo.png'
import PhotoSelectedIcon from '../assets/photoSelected.png'
import RankingIcon from '../assets/ranking.png'
import RankingSelectedIcon from '../assets/rankingSelected.png'

const Tab = createBottomTabNavigator()

export default function BottomTab () {
  const [tabSelected, setTabSelected] = useState('Photo')

  return (
    <Tab.Navigator
      showLabel={false}
      initialRouteName='Photo'
      tabBarOptions={{
        activeTintColor: '#e91e63',
        showLabel: false
      }}
    >
      <Tab.Screen
        name='User'
        listeners={{
          tabPress: e => {
            setTabSelected('User')
          }
        }}
        component={User}
        options={{
          showLabel: false,
          tabBarIcon: () => (
            <Image source={tabSelected === 'User' ? UserSelectedIcon : UserIcon} style={styles.icon} />
          )
        }}
      />
      <Tab.Screen
        name='Photo'
        listeners={{
          tabPress: e => {
            setTabSelected('Photo')
          }
        }}
        component={PhotoStack}
        options={{
          tabBarIcon: () => (
            <Image source={tabSelected === 'Photo' ? PhotoSelectedIcon : PhotoIcon} style={styles.icon} />
          )
        }}
      />
      <Tab.Screen
        name='Ranking'
        listeners={{
          tabPress: e => {
            setTabSelected('Ranking')
          }
        }}
        component={RankingScreen}
        options={{
          tabBarIcon: () => (
            <Image source={tabSelected === 'Ranking' ? RankingSelectedIcon : RankingIcon} style={styles.icon} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  icon: {
    transform: ([{
      scale: 0.07
    }])
  }
})
