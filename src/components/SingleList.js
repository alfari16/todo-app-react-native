import React, { PureComponent } from 'react'
import { Animated, Text, View, Alert } from 'react-native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/EvilIcons'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
import { RED, ORANGE, DARK_RED, DARK_GREEN, DARK_ORANGE } from '../util/color'

const AnimatedIcon = Animated.createAnimatedComponent(Icon)

export default class RawSingleList extends PureComponent {
  state = {
    isShow: true
  }
  _animated = new Animated.Value(0)
  _swipeableRow = null

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
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 2,
      marginBottom: 10
    },
    rectContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
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
    },
    leftAction: {
      backgroundColor: this.props.isComplete ? DARK_ORANGE : DARK_GREEN
    },
    actionIcon: {
      width: 30,
      marginHorizontal: 10
    },
    action: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row'
    },
    textAction: {
      color: 'white',
      fontSize: 18
    },
    rightAction: {
      backgroundColor: DARK_RED,
      justifyContent: 'flex-end'
    }
  })

  getCurrentCategory = () =>
    this.props.activeCategory === 'Semua'
      ? true
      : this.props.activeCategory === this.props.category

  componentDidMount() {
    this.setShow(this.getCurrentCategory())
  }
  componentDidUpdate() {
    if (this.getCurrentCategory()) this.setState({ isShow: true })
    this.setShow(this.getCurrentCategory())
    if (!this.getCurrentCategory()) {
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
    this._swipeableRow.close()
    const { id, isComplete, title } = this.props
    this.props.context._setList({
      id,
      title,
      value: isComplete
    })
  }

  completedChecklist = () => this.props.checklist.filter(el => el.isComplete)

  deleteTask = () => {
    this._swipeableRow.close()
    const { id, title } = this.props
    this.props.context._removeTask(id, title)
  }

  renderLeftActions = (progress, dragX) => {
    const { action, actionIcon, textAction, leftAction } = this.getStyle()
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })
    return (
      <RectButton style={[action, leftAction]}>
        <AnimatedIcon
          name={this.props.isComplete ? 'close' : 'check'}
          size={30}
          color="#fff"
          style={[actionIcon, { transform: [{ scale }] }]}
        />
        <Text style={textAction}>
          {this.props.isComplete ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
        </Text>
      </RectButton>
    )
  }
  renderRightActions = (progress, dragX) => {
    const { action, actionIcon, textAction, rightAction } = this.getStyle()
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })
    return (
      <RectButton style={[action, rightAction]}>
        <Text style={textAction}>Hapus</Text>
        <AnimatedIcon
          name="trash"
          size={30}
          color="#fff"
          style={[actionIcon, { transform: [{ scale }] }]}
        />
      </RectButton>
    )
  }
  updateRef = ref => {
    this._swipeableRow = ref
  }

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
      animated,
      rectContainer
    } = this.getStyle()

    const displayedDate = moment(date).calendar()
    const clock = moment(date).format('HH:mm')
    if (!this.state.isShow) return null
    return (
      <Animated.View style={[container, animated]}>
        <Swipeable
          ref={this.updateRef}
          friction={2}
          onSwipeableRightOpen={this.deleteTask}
          onSwipeableLeftOpen={this.onValueChange}
          leftThreshold={80}
          rightThreshold={80}
          renderLeftActions={this.renderLeftActions}
          renderRightActions={this.renderRightActions}
        >
          <RectButton
            onPress={() =>
              navigation.navigate('Task', {
                data
              })
            }
            style={rectContainer}
          >
            <View style={checkedWrapper}>
              <Icon name="check" color={DARK_ORANGE} size={50} />
              <View style={uncheckedWrapper}>
                <View style={unchecked} />
              </View>
            </View>
            <View style={meta}>
              <Text style={titleStyle}>{title}</Text>
              <Text style={subTitleStyle}>{category}</Text>
              {!!checklist.length && (
                <Text style={descStyle}>
                  {this.completedChecklist().length}/{checklist.length}{' '}
                  checklist selesai
                </Text>
              )}
              <Text style={timeStyle}>
                {displayedDate} - {clock}
              </Text>
            </View>
          </RectButton>
        </Swipeable>
      </Animated.View>
    )
  }
}
