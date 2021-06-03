import React from 'react'
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'

import Button from '../../components/Button'

import GoogleIcon from '../../assets/google.png'
import FacebookIcon from '../../assets/facebook.png'

import { Fonts } from '../../utils/Fonts'

export default function StepOne ({ navigation }) {
  function goToStepTwo () {
    navigation.navigate('StepTwo')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} enabled={Platform.OS === 'ios'} behavior='padding'>
        <View style={styles.container}>
          <Text style={styles.title}>Crie sua conta</Text>
          <View style={styles.button}>
            <Button text='Entrar com Google' textColor='#4285F4' backgroundColor='#FFFFFFFF' icon={GoogleIcon} height={50} />
            <Button text='Entrar com Facebook' textColor='#FFFFFFFF' backgroundColor='#1877F2' icon={FacebookIcon} height={50} />
            <Button text='Novo usuário' textColor='#FFFFFFFF' backgroundColor='#20C026' height={50} onPress={goToStepTwo} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4'
  },
  title: {
    fontFamily: Fonts.MontserratRegular,
    width: '70%',
    textAlign: 'center',
    fontSize: 48,
    color: '#9D9D9D'
  },
  button: {
    flex: 0.4,
    justifyContent: 'space-around',
    width: ' 70%'
  }
})
