import React from 'react'
import { View } from 'react-native'
import LottieView from 'lottie-react-native'

import RegisterSuccessfullyAnimation from '../../assets/animation/successfulAnimation.json'

export default function RegisterSuccessfully ({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LottieView source={RegisterSuccessfullyAnimation} autoPlay loop={false} resizeMode='contain' onAnimationFinish={() => navigation.navigate('BottomTab')} />
    </View>
  )
}
