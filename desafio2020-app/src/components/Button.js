import React from 'react'
import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native'

import { Fonts } from '../utils/Fonts'

export default function Button ({ text, backgroundColor, textColor, icon, height, width, ...props }) {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor, height, width }]} activeOpacity={0.7} {...props}>
      {icon && <Image style={styles.icon} source={icon} />}
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    borderRadius: 12,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  text: {
    fontFamily: Fonts.MontserratBold
  },
  icon: {
    width: 20,
    resizeMode: 'contain'
  }
})
