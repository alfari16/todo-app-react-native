import React, { Component } from 'react'
import { View } from 'react-native'
import AppNavigation from './AppNavigation'
import { storageVersion } from '../app.json'
import moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage'
import { Provider } from './util/context'

class App extends Component {
  state = {
    list: [],
    categories: [],
    addCategoryState: false,
    addTaskState: false
  }

  async componentDidMount() {
    await this.generateDummyData()
    const [listArr, categoriesArr] = await AsyncStorage.multiGet([
      `${storageVersion}-list`,
      `${storageVersion}-categories`
    ])
    const list = JSON.parse(listArr[1]) || []
    const categories = JSON.parse(categoriesArr[1]) || []
    this.setState({ list, categories })
  }
  generateDummyData = async () => {
    const multiSet = [
      [
        `${storageVersion}-list`,
        JSON.stringify([
          {
            id: Date.now() + Math.random(),
            title: 'Title 1',
            desc: 'Desc 1',
            date: moment()
              .subtract(3, 'months')
              .format(),
            checklist: [
              { text: 'Checklist 1', isComplete: true },
              { isComplete: false, text: 'Checklist 4' }
            ],
            category: 'Kuliah',
            reminder: true,
            isComplete: true
          },
          {
            id: Date.now() + Math.random(),
            title: 'Title 2',
            desc: null,
            date: moment()
              .add(3, 'hours')
              .add('30', 'minutes')
              .format(),
            checklist: [],
            category: 'Daily',
            reminder: false,
            isComplete: false
          },
          {
            id: Date.now() + Math.random(),
            title: 'Title 3',
            desc: 'Desc 3',
            date: moment()
              .add(1, 'days')
              .add('10', 'hours')
              .format(),
            checklist: [
              { isComplete: false, text: 'Checklist 3' },
              { isComplete: false, text: 'Checklist 2' }
            ],
            category: 'Main',
            reminder: false,
            isComplete: false
          },
          {
            id: Date.now() + Math.random(),
            title: 'Title 4',
            desc: 'Desc 4',
            date: moment()
              .add(3, 'days')
              .add('10', 'hours')
              .format(),
            checklist: ['Checklist 3', 'Checklist 2'],
            category: 'Kerja',
            reminder: false,
            isComplete: false
          }
        ])
      ],
      [
        `${storageVersion}-categories`,
        JSON.stringify([
          {
            id: 1,
            name: 'Kuliah'
          },
          {
            id: 2,
            name: 'Kerja'
          },
          {
            id: 3,
            name: 'Daily'
          }
        ])
      ]
    ]
    try {
      await AsyncStorage.multiSet(multiSet)
    } catch (error) {
      console.error(error)
      // Alert('Error!')
    }
  }

  _addCategory = name => {
    const categories = [...this.state.categories]
    categories.push({ name, id: Date.now() })
    this._setCategoryState(categories)
  }
  _addTask = name => {
    const list = [...this.state.list]
    list.push({ name, id: Date.now() })
    this._setTaskState(list)
  }
  _removeCategory = async id => {
    const categories = this.state.categories.filter(el => el.id !== id)
    this._setCategoryState(categories)
  }
  _setList = ({ id, value: isComplete }) => {
    const list = this.state.list.map(el => {
      if (el.id === id) return { ...el, isComplete }
      return el
    })
    console.log(id, isComplete)
    this._setTaskState(list)
  }
  _setCategory = ({ value: name, id }) => {
    const newCategories = this.state.categories.map(el => {
      if (el.id === id) return { name, id }
      return el
    })
    this._setCategoryState(newCategories)
  }
  _setTaskState = list => {
    this.setState({ list })
    AsyncStorage.setItem(`${storageVersion}-list`, JSON.stringify(list))
  }
  _setCategoryState = categories => {
    this.setState({ categories })
    AsyncStorage.setItem(
      `${storageVersion}-categories`,
      JSON.stringify(categories)
    )
  }
  _setAddCategoryState = addCategoryState => {
    this.setState({ addCategoryState })
  }
  _setAddTaskState = addTaskState => this.setState({ addTaskState })

  render() {
    const { list, categories, addCategoryState, addTaskState } = this.state
    return (
      <Provider
        value={{
          list,
          categories,
          addCategoryState,
          addTaskState,
          _setList: this._setList,
          _addCategory: this._addCategory,
          _removeCategory: this._removeCategory,
          _setCategory: this._setCategory,
          _setAddCategoryState: this._setAddCategoryState,
          _setAddTaskState: this._setAddTaskState
        }}
      >
        <View style={{ flex: 1 }}>
          <AppNavigation />
        </View>
      </Provider>
    )
  }
}

export default App
