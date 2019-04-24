import React from 'react'
import { Text } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { Consumer } from './util/context'
import Icon from 'react-native-vector-icons/EvilIcons'

import Main from './screen/Main'
import NewTask from './screen/NewTask'
import Task from './screen/Task'
import Category from './screen/Category'
import Credit from './components/Credit'

const AddBtn = (functionName, value) => (
  <Consumer>
    {props => (
      <Text
        onPress={() => props[functionName](value)}
        style={{
          fontWeight: '900',
          fontSize: 30,
          paddingBottom: 3,
          paddingHorizontal: 15
        }}
      >
        +
      </Text>
    )}
  </Consumer>
)

const openCredit = (
  <Consumer>
    {props => (
      <Icon
        onPress={props._setCreditPanel}
        name="navicon"
        size={30}
        style={{ marginHorizontal: 10 }}
      />
    )}
  </Consumer>
)

const Router = createStackNavigator(
  {
    Main: {
      screen: Main,
      navigationOptions: {
        title: 'Pengingat Tugas',
        headerRight: AddBtn('_setAddTaskState', true),
        headerLeft: openCredit,
        headerTitleStyle: {
          flex: 1,
          marginLeft: -10
        }
      }
    },
    NewTask: {
      screen: NewTask,
      navigationOptions: {
        title: 'Pengingat Baru'
      }
    },
    Category: {
      screen: Category,
      navigationOptions: {
        title: 'Kategori',
        headerTitleStyle: {
          flex: 1,
          textAlign: 'center'
        },
        headerRight: AddBtn('_setAddCategoryState', true)
      }
    },
    Task: {
      screen: Task,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('data', {}).title
      })
    },
    Credit: {
      screen: Credit,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'Main'
  }
)

export default createAppContainer(Router)
