import React, { useState } from 'react'
import { View, Text, SafeAreaView, KeyboardAvoidingView, Platform, StyleSheet, FlatList } from 'react-native'

import TeamButton from '../../components/TeamButton'
import Input from '../../components/Input'

import { Fonts } from '../../utils/Fonts'

export default function StepThree ({ navigation }) {
  const [teamSelected, setTeamSelected] = useState('')

  const teamButtons = [
    { text: '1', key: 'team1' },
    { text: '2', key: 'team2' },
    { text: '3', key: 'team3' },
    { text: '4', key: 'team4' },
    { text: '5', key: 'team5' },
    { text: '6', key: 'team6' },
    { text: '7', key: 'team7' },
    { text: '8', key: 'team8' },
    { text: '9', key: 'team9' },
    { text: '10', key: 'team10' },
    { text: '11', key: 'team11' },
    { text: '12', key: 'team12' },
    { text: '13', key: 'team13' }
  ]

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} enabled={Platform.OS === 'ios'} behavior='padding'>
        <View style={styles.container}>
          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.subTitle}>Escolha sua equipe!</Text>
          <FlatList
            keyExtractor={item => item.key}
            data={teamButtons}
            renderItem={({ item }) => <TeamButton key={item.key} text={item.text} pressed={item.key === teamSelected} onPress={() => setTeamSelected(item.key)} />}
            numColumns={2}
            horizontal={false}
            showsVerticalScrollIndicator={false}
          />
          <Text style={[styles.subTitle, { marginTop: 10 }]}>Código do líder</Text>
          <View style={styles.input}>
            <Input maxLength={4} keyboardType='numeric' textAlign='center' />
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
    padding: 30
  },
  title: {
    fontFamily: Fonts.MontserratRegular,
    fontSize: 48,
    color: '#20C026'
  },
  subTitle: {
    fontFamily: Fonts.MontserratRegular,
    fontSize: 24,
    color: '#6A6A6A',
    marginBottom: 10
  },
  input: {
    width: '50%'
  }
})
