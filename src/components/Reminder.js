import React from 'react'
import { CheckBox, Text, View } from 'react-native'

export default props => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <CheckBox {...props} />
    <View style={{ marginLeft: 10 }}>
      <Text>Set alarm pengingat</Text>
      <Text>(Aktifkan untuk menerima notifikasi)</Text>
    </View>
  </View>
)
