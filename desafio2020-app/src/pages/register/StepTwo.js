import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { Fonts } from '../../utils/Fonts'

export default function StepThree ({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 30 }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>Preencha os campos</Text>
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <Input maxLength={20} keyboardType='default' textAlign='center' placeholder='Nome' />
            </View>
            <View style={styles.input}>
              <Input maxLength={20} keyboardType='default' textAlign='center' placeholder='E-mail' />
            </View>
            <View style={styles.input}>
              <Input maxLength={10} keyboardType='default' textAlign='center' placeholder='Senha' password />
            </View>
          </View>
          <Button width='84%' text='Continuar' backgroundColor='#20C026' textColor='#FFFFFF' height={50} onPress={() => navigation.navigate('RegisterSuccessfully')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 40
  },
  title: {
    fontFamily: Fonts.MontserratRegular,
    alignSelf: 'stretch',
    color: '#9D9D9D',
    textAlign: 'center',
    fontSize: 48
  },
  inputContainer: {
    flex: 0.5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: '80%',
    marginBottom: 30
  }
})
