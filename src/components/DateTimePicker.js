import React from 'react'
import {
  TouchableWithoutFeedback,
  View,
  DatePickerAndroid,
  TimePickerAndroid,
  TextInput,
  Text,
  ToastAndroid
} from 'react-native'
import moment from 'moment'

import Input from './Input'

export default ({ onDateSelected, style, date }) => {
  // console.log(date, new Date())
  const selectDate = async () => {
    try {
      date = moment(date).toDate()
      const { action, year, month, day } = await DatePickerAndroid.open({
        date
      })
      if (action === DatePickerAndroid.dateSetAction) {
        const [hour, minute] = moment(date)
          .format('HH:mm')
          .split(':')
        const newTime = moment(`${year}/${month + 1}/${day}`, 'YYYY/M/D')
          .hour(hour)
          .minute(minute)
          .toDate()
        // console.log(newTime, 'ds')
        onDateSelected(newTime)
      }
    } catch (error) {
      ToastAndroid.show('Tidak dapat membuka date picker', ToastAndroid.SHORT)
      // console.error(error)
    }
  }

  const selectTime = async () => {
    try {
      const [cHour, cMinute] = moment(date)
        .format('HH:mm')
        .split(':')
      const { action, minute, hour } = await TimePickerAndroid.open({
        hour: Number(cHour),
        minute: Number(cMinute),
        is24Hour: true
      })
      if (action === TimePickerAndroid.timeSetAction) {
        const newTime = moment(date)
          .hour(hour)
          .minute(minute)
          .toDate()
        onDateSelected(newTime)
      }
    } catch (error) {
      ToastAndroid.show('Tidak dapat membuka time picker', ToastAndroid.SHORT)
      // console.error(error)
    }
  }

  const displayedDate = moment(date).calendar()
  const displayedTime = moment(date).format('HH:mm')
  const { container, leftChild, rightChild } = cStyle

  return (
    <View style={container}>
      {/* <Text>{integ}</Text> */}
      <NonClickableView func={selectDate} style={leftChild}>
        <Input value={displayedDate} style={style} label="Tanggal" />
      </NonClickableView>
      <NonClickableView func={selectTime} style={rightChild}>
        <Input value={displayedTime} style={style} label="Waktu" />
      </NonClickableView>
    </View>
  )
}

const cStyle = {
  container: {
    flexDirection: 'row'
  },
  leftChild: {
    marginRight: 5,
    flex: 2
  },
  rightChild: {
    marginLeft: 5,
    flex: 1
  }
}

const NonClickableView = ({ func, children, style }) => (
  <TouchableWithoutFeedback onPress={func}>
    <View style={style}>
      <View pointerEvents="none">{children}</View>
    </View>
  </TouchableWithoutFeedback>
)
