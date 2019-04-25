import React, { Component } from 'react'
import { Picker, View, ToastAndroid, ScrollView } from 'react-native'
import PushNotification from 'react-native-push-notification'

import Container from '../components/Container'
import Input from '../components/Input'
import DateTimePicker from '../components/DateTimePicker'
import CheckList from '../components/CheckList'
import Button from '../components/Button'
import Reminder from '../components/Reminder'

import { BLUE } from '../util/color'
import { ConsumerProps } from '../util/context.js'

class NewTask extends Component {
  getCategory = () =>
    this.props.context.categories[0]
      ? this.props.context.categories[0].name
      : null

  state = {
    form: {
      id: Date.now(),
      title: null,
      desc: null,
      date: new Date(),
      checklist: [],
      category: this.getCategory(),
      reminder: true,
      ...this.props.navigation.getParam('data', {})
    }
  }
  titleRef = null
  didFocusListener = null

  componentDidUpdate() {
    if (this.state.form.category === 0) {
      this.props.navigation.navigate('Category')
      this.setState(prev => ({
        ...prev,
        form: { ...prev.form, category: false }
      }))
    }
  }

  categoryCheck = () => {
    if (!this.props.context.categories.length) {
      ToastAndroid.show(
        'Kamu harus menambahkan kategori terlebih dahulu',
        ToastAndroid.SHORT
      )
      this.props.navigation.navigate('Category')
    } else if (!this.state.form.category)
      this.setState(prev => ({
        ...prev,
        form: {
          ...prev.form,
          category: this.getCategory()
        }
      }))
    // console.log(this.state.form)
  }

  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', () =>
      this.categoryCheck()
    )
  }

  componentWillUnmount() {
    this.didFocusListener.remove()
  }

  handleChange = (key, value) => {
    this.setState(prev => ({
      ...prev,
      form: { ...prev.form, [key]: value }
    }))
  }

  saveTask = async () => {
    const { isTask, title, id, date, reminder } = this.state.form
    if (title) {
      this.props.context._addTask(this.state.form)

      await PushNotification.cancelLocalNotifications({
        id: id
      })
      if (reminder) {
        try {
          await PushNotification.localNotificationSchedule({
            id,
            userInfo: { id: id },
            date,
            message: `Hai! Kamu punya tugas nih: ${title}`,
            title: 'Pengingat Tugas!',
            bigText: `Hai! Sibuk ya? Jangan lupa ada tugas yang harus kamu selesaikan: ${title}`,
            smallIcon: 'icon'
          })
        } catch (error) {
          ToastAndroid.show('Gagal melakukan notifikasi', ToastAndroid.SHORT)
        }
      }
      if (isTask)
        this.props.navigation.navigate('Task', { data: this.state.form })
      else this.props.navigation.navigate('Main')
    } else this.titleRef.focus()
  }

  render() {
    const {
      form: { title, desc, date, checklist, category, reminder }
    } = this.state
    const { input, button, btnWrapper, inputContainer } = style

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <Input
            value={title}
            label="Nama"
            style={input}
            containerStyle={inputContainer}
            ref={ref => (this.titleRef = ref)}
            placeholder="Nama Pengingat"
            autoCorrect={false}
            onChangeText={v => this.handleChange('title', v)}
          />
          <Input
            value={desc}
            style={input}
            autoCorrect={false}
            containerStyle={inputContainer}
            label="Deskripsi"
            placeholder="Deskripsi Pengingat"
            multiline
            onChangeText={v => this.handleChange('desc', v)}
          />
          <DateTimePicker
            style={input}
            containerStyle={inputContainer}
            date={date}
            onDateSelected={v => this.handleChange('date', v)}
          />
          <CategoryPicker
            style={input}
            containerStyle={inputContainer}
            category={category}
            categories={this.props.context.categories}
            onValueChange={e => this.handleChange('category', e)}
          />
          <CheckList
            items={checklist}
            onChange={e => this.handleChange('checklist', e)}
          />
          <Reminder
            value={reminder}
            onValueChange={v => this.handleChange('reminder', v)}
          />
          <View style={{ flex: 1 }} />
          <Button
            onPress={this.saveTask}
            childStyle={button}
            style={btnWrapper}
            block
            style={{ marginTop: 20 }}
            icon="archive"
          >
            SIMPAN PENGINGAT
          </Button>
        </Container>
      </ScrollView>
    )
  }
}

const style = {
  input: {
    minHeight: 50,
    borderBottomWidth: 1,
    fontSize: 17,
    borderRadius: 5,
    borderColor: '#aaa'
  },
  inputContainer: {
    marginBottom: 15
  },
  btnWrapper: {
    backgroundColor: 'red'
  },
  button: {
    textAlign: 'center',
    color: BLUE,
    fontWeight: '900'
  }
}

const CategoryPicker = ({ style, category, onValueChange, categories }) => (
  <Input label="Kategori" useBorder>
    <Picker
      style={style}
      selectedValue={category}
      onValueChange={onValueChange}
    >
      {categories.map(({ name, id }) => (
        <Picker.Item label={name} value={name} key={id} color="#333" />
      ))}
      <Picker.Item label="Tambah kategori" value={0} color={BLUE} />
    </Picker>
  </Input>
)

export default ConsumerProps(NewTask)
