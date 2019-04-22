import React, { PureComponent } from 'react'
import {
  Animated,
  Text,
  View,
  TouchableWithoutFeedback,
  Alert
} from 'react-native'
import moment from 'moment'
import Card from './Card'
import Icon from 'react-native-vector-icons/EvilIcons'
import { RED, ORANGE } from '../util/color'

export default class RawSingleList extends PureComponent {
  state = {
    isShow: true
  }
  _animated = new Animated.Value(0)

  getBgColor = () =>
    moment(this.props.date).isSame(moment().format(), 'day')
      ? RED
      : moment(this.props.date).isSame(
          moment()
            .add(1, 'day')
            .format(),
          'day'
        )
      ? ORANGE
      : 'white'

  getStyle = () => ({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: this.getBgColor()
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
    unchecked: {
      backgroundColor: this.props.isComplete
        ? 'transparent'
        : this.getBgColor(),
      width: 25,
      height: 25,
      borderRadius: 12.5
    },
    uncheckedWrapper: {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    },
    checkedWrapper: {
      position: 'relative'
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
  })

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

  onValueChange = () => {
    const { id, changeStatus, isComplete, title } = this.props
    Alert.alert(
      'Apakah kamu yakin?',
      isComplete
        ? `Tugas ${title} belum selesai?`
        : `Tugas ${title} sudah selesai?`,
      [
        {
          text: 'Tidak'
        },
        {
          text: 'Ya',
          onPress: () => {
            changeStatus({ id, value: !isComplete })
          }
        }
      ],
      {
        onDismiss: () => false
      }
    )
  }

  completedChecklist = () => this.props.checklist.filter(el => el.isComplete)

  render() {
    const { title, date, checklist, navigation, category, data } = this.props
    const {
      container,
      meta,
      titleStyle,
      subTitleStyle,
      descStyle,
      checkedWrapper,
      unchecked,
      uncheckedWrapper,
      timeStyle,
      animated
    } = this.getStyle()

    const displayedDate = moment(date).calendar()
    const clock = moment(date).format('HH:mm')
    if (!this.state.isShow) return null
    return (
      <Animated.View style={animated}>
        <Card
          style={container}
          onPress={() => navigation.navigate('Task', { data })}
        >
          <TouchableWithoutFeedback onPress={this.onValueChange}>
            <View style={checkedWrapper}>
              <Icon name="check" size={50} />
              <View style={uncheckedWrapper}>
                <View style={unchecked} />
              </View>
            </View>
          </TouchableWithoutFeedback>
          {/* <CheckBox value={isComplete} onValueChange={this.onValueChange} /> */}
          <View style={meta}>
            <Text style={titleStyle}>{title}</Text>
            <Text style={subTitleStyle}>{category}</Text>
            {!!checklist.length && (
              <Text style={descStyle}>
                {this.completedChecklist().length}/{checklist.length} checklist
                selesai
              </Text>
            )}
            <Text style={timeStyle}>
              {displayedDate} | Pukul: {clock}
            </Text>
          </View>
        </Card>
      </Animated.View>
    )
  }
}
