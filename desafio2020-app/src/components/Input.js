import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

import { Fonts } from '../utils/Fonts'

export default function Input ({ keyboardType, maxLength, textAlign, placeholder, password, ...props }) {
  return (
    <View style={styles.container} {...props}>
      <Text style={styles.placeholder}>{placeholder}</Text>
      <TextInput style={[styles.input, { textAlign }]} keyboardType={keyboardType} maxLength={maxLength} secureTextEntry={password} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    width: '100%',
    height: 70
  },
  placeholder: {
    fontFamily: Fonts.MontserratRegular,
    fontSize: 24,
    color: '#6A6A6A',
    marginBottom: 4
  },
  input: {
    fontFamily: Fonts.MontserratBold,
    color: '#20C026',
    textAlign: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#20C026',
    height: 50
  }
})
