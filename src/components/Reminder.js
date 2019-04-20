import React from 'react'
import { CheckBox, Text, View } from 'react-native'

export default props => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <CheckBox {...props} />
    <Text>{props.label}</Text>
  </View>
)
