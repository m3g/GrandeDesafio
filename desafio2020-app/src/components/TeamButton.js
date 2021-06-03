import React from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'

import { Fonts } from '../utils/Fonts'

export default function TeamButton ({ text, pressed, ...props }) {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: pressed ? '#20C026' : 'transparent' }]} activeOpacity={1} {...props}>
      <Text style={[styles.text, { color: pressed ? '#FFFFFF' : '#20C026' }]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    width: 90,
    borderRadius: 10,
    borderColor: '#20C026',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  text: {
    fontFamily: Fonts.MontserratRegular,
    fontSize: 28,
    color: '#20C026'
  }
})
