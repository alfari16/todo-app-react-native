import React from 'react'
import { View, Text } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { withNavigation } from 'react-navigation'
import { ConsumerProps } from '../util/context'
import moment from 'moment'
import RawSingleList from './SingleList'

const SingleList = ConsumerProps(withNavigation(RawSingleList))

export default ({ list, changeStatus, activeCategory }) => {
  const sort = list.sort(
    (a, b) => moment(a.date).unix() - moment(b.date).unix()
  )
  const incomplete = [
    {
      id: -1,
      text: 'Tugas Belum selesai'
    },
    ...sort.filter(el => !el.isComplete)
  ]
  const complete = [
    {
      id: -2,
      text: 'Tugas selesai'
    },
    ...sort.filter(el => el.isComplete)
  ]
  list = [...incomplete, ...complete]
  if (!sort.length)
    return (
      <Text style={{ color: '#999', textAlign: 'center', marginTop: 20 }}>
        Tidak ada tugas
      </Text>
    )
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
            activeCategory={activeCategory}
            delay={data.index}
            changeStatus={changeStatus}
          />
        )
      }
    />
  )
}
