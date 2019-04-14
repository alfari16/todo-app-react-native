import React from 'react'
import { View, TouchableNativeFeedback } from 'react-native'

export default ({ onPress = () => {}, style = {}, children }) => {
  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple('ghostWhite', false)}
      onPress={onPress}
    >
      <View style={[componentStyle, style]}>{children}</View>
    </TouchableNativeFeedback>
  )
}

const componentStyle = {
  backgroundColor: 'white',
  elevation: 2,
  padding: 10,
  marginBottom: 10
}
