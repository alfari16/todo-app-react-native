import React from 'react'
import { View, Dimensions } from 'react-native'

export default props => (
  <View
    style={[
      {
        flex: 1,
        paddingTop: 15,
        paddingHorizontal: 15,
        backgroundColor: 'white'
      },
      props.style
    ]}
  >
    {props.children}
  </View>
)
