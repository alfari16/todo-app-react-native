import React, { Component } from 'react'
import { View, Alert, ToastAndroid } from 'react-native'
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
    addTaskState: false,
    creditPanel: false
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
              .toDate(),
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
              .toDate(),
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
              .toDate(),
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
              .add(1, 'month')
              .toDate(),
            checklist: [
              { isComplete: false, text: 'Checklist 3' },
              { isComplete: true, text: 'Checklist 2' }
            ],
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
      // console.error(error)
      ToastAndroid.show('Gagal load AsyncStorage', ToastAndroid.LONG)
    }
  }

  _goToAppInfo = () => this.props.navigation
  _addCategory = name => {
    const categories = [...this.state.categories]
    categories.push({ name, id: Date.now() })
    this._setCategoryState(categories)
  }
  _addTask = newList => {
    const list = [...this.state.list]
    const foundIdx = list.findIndex(el => el.id === newList.id)
    if (foundIdx > -1) list[foundIdx] = newList
    else list.push(newList)
    this._setTaskState(list)
  }
  _removeTask = (id, title) => {
    return new Promise(res => {
      Alert.alert('Apakah kamu yakin?', `Ingin menghapus ${title}?`, [
        { text: 'Tidak', onPress: () => res(false) },
        {
          text: 'Ya',
          onPress: () => {
            const list = [...this.state.list].filter(el => el.id !== id)
            this._setTaskState(list)
            res(true)
          }
        }
      ])
    })
  }
  _removeCategory = async id => {
    const categories = this.state.categories.filter(el => el.id !== id)
    this._setCategoryState(categories)
  }
  _setChecklist = ({ id, checklist }) => {
    const list = this.state.list
    const find = list.find(el => el.id === id)
    find.checklist = checklist
    this._setTaskState(list)
  }
  _setList = ({ id, title, value: isComplete }) => {
    return new Promise(res => {
      Alert.alert(
        'Apakah kamu yakin?',
        isComplete
          ? `Tugas ${title} belum selesai?`
          : `Tugas ${title} sudah selesai?`,
        [
          {
            text: 'Tidak',
            onPress: () => res(false)
          },
          {
            text: 'Ya',
            onPress: () => {
              const list = this.state.list.map(el => {
                if (el.id === id) return { ...el, isComplete: !isComplete }
                return el
              })
              this._setTaskState(list)
              // console.log(list)
              res(true)
            }
          }
        ],
        {
          onDismiss: () => res(false)
        }
      )
    })
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
  _setCreditPanel = () =>
    this.setState({ creditPanel: !this.state.creditPanel })

  render() {
    const {
      list,
      categories,
      addCategoryState,
      addTaskState,
      creditPanel
    } = this.state
    return (
      <Provider
        value={{
          list,
          categories,
          addCategoryState,
          addTaskState,
          creditPanel,
          _setChecklist: this._setChecklist,
          _addTask: this._addTask,
          _removeTask: this._removeTask,
          _setList: this._setList,
          _addCategory: this._addCategory,
          _removeCategory: this._removeCategory,
          _setCategory: this._setCategory,
          _setAddCategoryState: this._setAddCategoryState,
          _setAddTaskState: this._setAddTaskState,
          _setCreditPanel: this._setCreditPanel
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
