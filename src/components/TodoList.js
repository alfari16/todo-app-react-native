import React from 'react'
import { View, Text, FlatList } from 'react-native'
import { withNavigation } from 'react-navigation'
import moment from 'moment'
import RawSingleList from './SingleList'

const SingleList = withNavigation(RawSingleList)

export default ({ list, changeStatus }) => {
  const sort = list.sort(
    (a, b) => moment(a.date).unix() - moment(b.date).unix()
  )
  const incomplete = [
    { id: Date.now() + 1, text: 'Tugas Belum selesai' },
    ...sort.filter(el => !el.isComplete)
  ]
  const complete = [
    { id: Date.now() + 2, text: 'Tugas selesai' },
    ...sort.filter(el => el.isComplete)
  ]
  list = [...incomplete, ...complete]
  return (
    <FlatList
      data={list}
      keyExtractor={data => data.id.toString()}
      renderItem={data =>
        data.item.text ? (
          <View
            style={{
              borderBottomColor: '#eee',
              borderBottomWidth: 0.7,
              paddingVertical: 10,
              marginBottom: 10
            }}
          >
            <Text>{data.item.text}</Text>
          </View>
        ) : (
          <SingleList
            {...data.item}
            data={data.item}
            delay={data.index}
            changeStatus={changeStatus}
          />
        )
      }
    />
  )
}
