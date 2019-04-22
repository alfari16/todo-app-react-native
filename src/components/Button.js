import React, { memo } from 'react'
import { TouchableNativeFeedback, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'

const Button = memo(({ onPress, style, childStyle, children, icon }) => (
  <TouchableNativeFeedback useForeground onPress={onPress}>
    <View style={[defaultStyle, style]}>
      <Icon name={icon} style={[iconStyle, childStyle]} size={25} />
      <Text style={[{ alignItems: 'center' }, childStyle]}>{children}</Text>
    </View>
  </TouchableNativeFeedback>
))

const defaultStyle = {
  height: 50,
  justifyContent: 'center',
  paddingHorizontal: 20,
  flexDirection: 'row',
  alignItems: 'center'
}
const iconStyle = {
  marginRight: 10
}

export default Button
