import React, { Fragment, PureComponent, memo } from 'react'
import { Text, View, Dimensions, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import moment from 'moment'

import Container from '../components/Container'
import Button from '../components/Button'
import CheckList from '../components/CheckList'
import { LIGHT_BLUE, BLUE, DARK_ORANGE, DARK_RED } from '../util/color'
import { ConsumerProps } from '../util/context'

class Task extends PureComponent {
  handleChecklist = checklist => {
    const { id } = this.props.navigation.getParam('data', {})
    this.props.context._setChecklist({ checklist, id })
  }

  editForm = () => {
    const data = this.props.navigation.getParam('data', {})
    this.props.navigation.navigate('NewTask', {
      data: { ...data, isTask: true }
    })
  }

  deleteTask = async (id, title) => {
    const deleted = await this.props.context._removeTask(id, title)
    if (deleted) this.props.navigation.goBack()
  }
  changeStatus = async ({ id, title, value }) => {
    const changed = await this.props.context._setList({ id, title, value })
    if (changed) {
      const data = this.props.navigation.getParam('data', {})
      this.props.navigation.setParams({
        data: { ...data, isComplete: !data.isComplete }
      })
    }
  }

  render() {
    const {
      isComplete,
      title,
      date,
      desc,
      checklist,
      id,
      reminder
    } = this.props.navigation.getParam('data', {})
    const {
      container,
      card,
      contentContainer,
      floating,
      header,
      title: titleStyle,
      date: dateStyle,
      desc: descStyle
    } = style

    const displayedDate = moment(date).format('dddd, DD MMM YYYY HH:mm')
    return (
      <ScrollView contentContainerStyle={container}>
        <View style={floating} />
        <Container style={contentContainer}>
          <Status isComplete={isComplete} />
          <View style={card}>
            <View style={header}>
              <View>
                <Text style={titleStyle}>
                  {title}{' '}
                  {reminder && <Icon name="clock" color={DARK_RED} size={20} />}
                </Text>
                <Text style={dateStyle}>{displayedDate}</Text>
              </View>
              <Icon
                name="pencil"
                onPress={this.editForm}
                color={BLUE}
                size={35}
              />
            </View>
            {!!desc && <Text style={descStyle}>{desc}</Text>}
            {!!checklist.length && (
              <CheckList
                items={checklist}
                showCheck
                onChange={this.handleChecklist}
              />
            )}
            <Action
              isComplete={isComplete}
              title={title}
              id={id}
              deleteTask={this.deleteTask}
              changeStatus={this.changeStatus}
            />
          </View>
        </Container>
      </ScrollView>
    )
  }
}

const style = {
  container: {
    position: 'relative',
    marginTop: -15,
    flexGrow: 1
  },
  contentContainer: {
    backgroundColor: 'transparent'
  },
  floating: {
    position: 'absolute',
    width: Dimensions.get('screen').width + 300,
    height: Dimensions.get('screen').width + 300,
    backgroundColor: LIGHT_BLUE,
    borderRadius: (Dimensions.get('screen').width + 300) / 2,
    top: -((Dimensions.get('screen').width + 300) / 1.25),
    left: -150,
    zIndex: -99
  },
  title: {
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
    fontSize: 18
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  date: {
    color: '#aaa',
    fontWeight: '600',
    fontSize: 13
  },
  card: {
    marginTop: 20,
    flexDirection: 'column',
    backgroundColor: 'rgba(255,255,255,.8)',
    padding: 15,
    borderRadius: 5,
    elevation: 3
  },
  desc: {
    color: '#555',
    marginBottom: 10,
    fontSize: 15
  }
}

const Status = memo(({ isComplete }) => {
  const { container, text } = {
    container: {
      width: 50,
      height: 50,
      backgroundColor: 'white',
      elevation: 5,
      borderRadius: 25,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20
    },
    text: {
      textAlign: 'center',
      marginTop: 10,
      color: '#fff',
      fontWeight: '700'
    }
  }
  return (
    <Fragment>
      <View style={container}>
        <Icon name={isComplete ? 'check' : 'close'} size={40} color={BLUE} />
      </View>
      <Text style={text}>{isComplete ? 'Sudah Selesai' : 'Belum Selesai'}</Text>
    </Fragment>
  )
})

const Action = memo(({ isComplete, id, title, deleteTask, changeStatus }) => {
  const { button, child, container } = {
    button: {
      width: (Dimensions.get('screen').width - 60) / 2
    },
    child: { textAlign: 'center', color: 'white' },
    container: {
      flexDirection: 'row',
      borderRadius: 25,
      overflow: 'hidden',
      marginTop: 20
    }
  }
  return (
    <View style={container}>
      <Button
        childStyle={child}
        style={[button, { backgroundColor: isComplete ? DARK_ORANGE : BLUE }]}
        onPress={() => changeStatus({ id, title, value: isComplete })}
        icon={isComplete ? 'close' : 'check'}
      >
        {isComplete ? 'Belum Selesai' : 'Tandai Selesai'}
      </Button>
      <Button
        childStyle={child}
        style={[button, { backgroundColor: DARK_RED }]}
        onPress={() => deleteTask(id, title)}
        icon="trash"
      >
        Hapus
      </Button>
    </View>
  )
})

export default ConsumerProps(Task)
