import React from 'react'
import { Text } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { Consumer } from './util/context'

import Main from './screen/Main'
import NewTask from './screen/NewTask'
import Task from './screen/Task'
import Category from './screen/Category'

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

const Router = createStackNavigator(
  {
    Main: {
      screen: Main,
      navigationOptions: {
        title: 'Tugasku',
        headerRight: AddBtn('_setAddTaskState', true)
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
      screen: Task
    }
  },
  {
    initialRouteName: 'Main'
  }
)

export default createAppContainer(Router)
