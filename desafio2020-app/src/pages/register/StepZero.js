import React, { useState } from 'react'
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet, TextInput } from 'react-native'

import { Fonts } from '../../utils/Fonts'

import Button from '../../components/Button'

export default function StepZero ({ navigation }) {
  const [Code, setCode] = useState('')
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} enabled={Platform.OS === 'ios'} behavior='padding'>
        <View style={styles.container}>
          <Text style={styles.title}>Digite seu código de participante</Text>
          <View style={styles.button}>
            <TextInput
              style={{ height: 50, color: '#20C026', fontSize: 24 }}
              value={Code}
              onChangeText={(text) => { setCode(text) }}
            />
          </View>
          <Button width='60%' text='Continuar' backgroundColor='#20C026' textColor='#FFFFFF' height={50} onPress={() => navigation.navigate('StepOne')} />
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
    fontSize: 36,
    color: '#9D9D9D'
  },
  button: {
    flex: 0.1,
    justifyContent: 'space-around',
    width: ' 70%',
    borderBottomWidth: 3,
    borderColor: '#999999',
    height: 70,
    margin: 20
  },
  text: {
    fontSize: 24,
    color: '#fff',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 5
  }
})
