import React, { memo } from 'react'
import { TouchableWithoutFeedback, View, Text } from 'react-native'

export default memo(({ onPress }) => {
  const { close, closeWrapper } = {
    close: {
      fontWeight: '900',
      fontSize: 26,
      transform: [{ rotate: '45deg' }]
    },
    closeWrapper: {
      paddingLeft: 20
    }
  }
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={closeWrapper}>
        <Text style={close}>+</Text>
      </View>
    </TouchableWithoutFeedback>
  )
})
