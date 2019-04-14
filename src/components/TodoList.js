import React, { Fragment, PureComponent } from 'react'
import { FlatList, Text, View, CheckBox, Alert } from 'react-native'
import { withNavigation } from 'react-navigation'
import moment from 'moment'
import Card from './Card'
import { RED, ORANGE } from '../util/color'

class RawSingleList extends PureComponent {
  style = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: moment(this.props.date).isSame(moment().format(), 'day')
        ? RED
        : moment(this.props.date).isSame(
            moment()
              .add(1, 'day')
              .format(),
            'day'
          )
        ? ORANGE
        : 'white'
    },
    meta: {
      flex: 1,
      marginLeft: 10
    },
    titleStyle: {
      fontWeight: '900',
      fontSize: 16
    },
    subTitleStyle: {
      fontWeight: '500',
      fontSize: 12
    },
    descStyle: {
      color: '#888'
    },
    flexWrap: {
      flexDirection: 'row'
    },
    timeStyle: {
      fontStyle: 'italic',
      marginTop: 6,
      paddingTop: 5,
      borderTopColor: '#aaa',
      borderTopWidth: 0.5
    },
    helper: {
      borderBottomColor: '#eee',
      borderBottomWidth: 0.7,
      paddingVertical: 10,
      marginBottom: 10
    }
  }

  onValueChange = value => {
    const { id, changeStatus } = this.props
    changeStatus({ id, value })
    Alert.alert(
      'Apakah kamu yakin?',
      value
        ? `Tugas ${this.props.title} sudah selesai?`
        : `Tugas ${this.props.title} belum selesai?`,
      [
        {
          text: 'Tidak',
          onPress: () => changeStatus({ id, value: !value })
        },
        { text: 'Ya' }
      ],
      {
        onDismiss: () => false
      }
    )
  }

  render() {
    const {
      title,
      desc,
      date,
      isComplete,
      checklist,
      navigation,
      category,
      text,
      data
    } = this.props
    const {
      container,
      meta,
      titleStyle,
      subTitleStyle,
      descStyle,
      flexWrap,
      timeStyle,
      helper
    } = this.style

    const displayedDate = moment(date).calendar()
    const clock = moment(date).format('HH:mm')

    return (
      <Fragment>
        {text && (
          <View style={helper}>
            <Text>{text}</Text>
          </View>
        )}
        <Card
          style={container}
          onPress={() => navigation.navigate('Task', { data })}
        >
          <CheckBox value={isComplete} onValueChange={this.onValueChange} />
          <View style={meta}>
            <Text style={titleStyle}>{title}</Text>
            <Text style={subTitleStyle}>{category}</Text>
            <View style={flexWrap}>
              {desc && <Text style={descStyle}>{desc}</Text>}
              {desc && !!checklist.length && <Text> - </Text>}
              {!!checklist.length && (
                <Text style={descStyle}>{checklist.length} checklist</Text>
              )}
            </View>
            <Text style={timeStyle}>
              {displayedDate} | Pukul: {clock}
            </Text>
          </View>
        </Card>
      </Fragment>
    )
  }
}

const SingleList = withNavigation(RawSingleList)

export default ({ list, changeStatus }) => {
  const sort = list.sort(
    (a, b) => moment(a.date).unix() - moment(b.date).unix()
  )
  const incomplete = sort
    .filter(el => !el.isComplete)
    .map((el, idx) => (idx === 0 ? { ...el, text: 'Tugas Belum selesai' } : el))
  const complete = sort
    .filter(el => el.isComplete)
    .map((el, idx) => (idx === 0 ? { ...el, text: 'Tugas Selesai' } : el))
  list = [...incomplete, ...complete]
  return (
    <FlatList
      data={list}
      keyExtractor={data => data.id.toString()}
      renderItem={data => (
        <SingleList
          {...data.item}
          data={data.item}
          changeStatus={changeStatus}
        />
      )}
    />
  )
}
