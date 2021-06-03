import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { Fonts } from '../utils/Fonts'

import Button from '../components/Button'

export default function HomeScreen ({ navigation }) {
  const text1 = 'Grande Desafio 2020'
  const text2 = 'Vamos tornar campinas uma cidade mais limpa?'
  const text3 = 'Fotográfe lixo no espaço público e ganhe pontos!'

  const data = [text1, text2, text3]

  return (
    <>
      <SafeAreaView style={{ flex: 1, alignItems: 'center', padding: 30 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F4F4' }}>
          <Carousel
            data={data}
            renderItem={({ item, index }) => {
              return (
                <View style={{ flex: 1, margin: 30, justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                  <Text style={[styles.text, { textAlign: index === 0 ? 'center' : 'left' }]}>{item}</Text>
                </View>)
            }}
            itemWidth={400}
            sliderWidth={400}
            windowSize={1}
          />
        </View>
        <Button width='80%' text='Continuar' backgroundColor='#20C026' textColor='#FFFFFF' height={50} onPress={() => navigation.navigate('StepZero')} />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 48,
    fontFamily: Fonts.MontserratMedium,
    color: '#20C026',
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'left'
  },
  button: {
    fontSize: 24,
    color: '#fff',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 5
  }
})
