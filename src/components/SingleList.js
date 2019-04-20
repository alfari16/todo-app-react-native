import React, { PureComponent, Fragment } from 'react'
import { Animated, Text, View, CheckBox, Alert } from 'react-native'
import moment from 'moment'
import Card from './Card'
import { RED, ORANGE } from '../util/color'

export default class RawSingleList extends PureComponent {
  state = {
    _viewHeight: 0,
    isShow: true
  }
  _animated = new Animated.Value(0)
  _animatedFade = new Animated.Value(0)

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
    animated: {
      opacity: this._animated,
      transform: [
        {
          translateY: this._animated.interpolate({
            inputRange: [0, 1],
            outputRange: [200, 0]
          })
        }
      ]
    }
  }

  componentDidMount() {
    this.setShow(this.props.isShow)
  }
  componentDidUpdate() {
    if (this.props.isShow) this.setState({ isShow: true })
    this.setShow(this.props.isShow)
    if (!this.props.isShow) {
      setTimeout(() => {
        this.setState({ isShow: false })
      }, 300)
    }
  }

  setShow = isShow => {
    Animated.timing(this._animated, {
      toValue: isShow ? 1 : 0,
      duration: 300,
      delay: isShow ? this.props.delay * 100 : 0,
      useNativeDriver: true
    }).start()
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
      data
    } = this.props
    const {
      container,
      meta,
      titleStyle,
      subTitleStyle,
      descStyle,
      flexWrap,
      timeStyle
    } = this.style

    const displayedDate = moment(date).calendar()
    const clock = moment(date).format('HH:mm')
    if (!this.state.isShow) return null
    return (
      <Animated.View
        onLayout={e =>
          this.setState({
            _viewHeight: e.nativeEvent.layout.height
          })
        }
        style={this.style.animated}
      >
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
      </Animated.View>
    )
  }
}
