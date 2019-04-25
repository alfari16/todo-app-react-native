import React, { Component } from 'react'
import { View, Alert, ToastAndroid } from 'react-native'
import AppNavigation from './AppNavigation'
import { storageVersion } from '../app.json'
import moment from 'moment'
import AsyncStorage from '@react-native-community/async-storage'
import { Provider } from './util/context'
import SplashScreen from 'react-native-splash-screen'
import PushNotif from 'react-native-push-notification'

class App extends Component {
  state = {
    list: [],
    categories: [],
    addCategoryState: false,
    addTaskState: false,
    creditPanel: false
  }

  async componentDidMount() {
    const registered = await AsyncStorage.getItem(
      `${storageVersion}-registered`
    )
    if (!registered) await this.generateDummyData()
    const [listArr, categoriesArr] = await AsyncStorage.multiGet([
      `${storageVersion}-list`,
      `${storageVersion}-categories`
    ])
    const list = JSON.parse(listArr[1]) || []
    const categories = JSON.parse(categoriesArr[1]) || []
    SplashScreen.hide()
    this.setState({ list, categories })
  }
  generateDummyData = async () => {
    const multiSet = [
      [
        `${storageVersion}-list`,
        JSON.stringify([
          {
            id: Date.now() + Math.random(),
            title: 'Swipe ke kanan untuk menghapus',
            desc:
              'Kamu bisa menambah checklist dengan mengedit tugas ini. Tap pada ikon pensil.',
            date: moment()
              .subtract(3, 'months')
              .toDate(),
            checklist: [
              { text: 'Mengumpulkan foto', isComplete: true },
              { isComplete: false, text: 'Membeli bunga' }
            ],
            category: 'Daily',
            reminder: false,
            isComplete: true
          },
          {
            id: Date.now() + Math.random(),
            title: 'Swipe ke kiri untuk menyelesaikan tugas',
            desc:
              'Tanda alarm disamping judul adalah tanda notifikasi di aktifkan pada tugas ini.',
            date: moment()
              .add('30', 'minutes')
              .toDate(),
            checklist: [],
            category: 'Daily',
            reminder: true,
            isComplete: false
          }
        ])
      ],
      [
        `${storageVersion}-categories`,
        JSON.stringify([
          {
            id: 1,
            name: 'Daily'
          }
        ])
      ],
      [`${storageVersion}-registered`, 'true']
    ]
    try {
      await AsyncStorage.multiSet(multiSet)
    } catch (error) {
      console.error(error)
      ToastAndroid.show('Gagal load AsyncStorage', ToastAndroid.LONG)
    }
    // PushNotif.localNotificationSchedule({
    //   id: '2139',
    //   date: moment()
    //     .add('30', 'minutes')
    //     .toDate(),
    //   message: `Hai! Kamu punya tugas nih: Contoh Pengingat`,
    //   title: 'Pengingat Tugas!',
    //   bigText: `Hai! Sibuk ya? Jangan lupa ada tugas yang harus kamu selesaikan.`,
    //   smallIcon: 'icon'
    // })
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
