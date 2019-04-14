import React, { memo } from 'react'
import { TouchableNativeFeedback, View, Text } from 'react-native'

const Button = memo(({ onPress, style, childStyle, children }) => (
  <TouchableNativeFeedback useForeground onPress={onPress}>
    <View style={[defaultStyle, style]}>
      <Text style={[childStyle]}>{children}</Text>
    </View>
  </TouchableNativeFeedback>
))

const defaultStyle = {
  height: 50,
  justifyContent: 'center',
  paddingHorizontal: 20
}

export default Button
