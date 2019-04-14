import React, { Component } from 'react'
import {
  CheckBox,
  Picker,
  View,
  Text,
  ToastAndroid,
  ScrollView
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { storageVersion } from '../../app.json'

import Container from '../components/Container'
import Input from '../components/Input'
import DateTimePicker from '../components/DateTimePicker'
import CheckList from '../components/CheckList'
import Button from '../components/Button'

import { BLUE } from '../util/color'
import { ConsumerProps } from '../util/context.js'

class NewTask extends Component {
  state = {
    form: {
      title: null,
      desc: null,
      date: new Date(),
      checklist: [],
      category: null,
      reminder: false
    }
  }
  titleRef = null

  componentDidUpdate() {
    if (this.state.form.category === 0) {
      this.props.navigation.navigate('Category')
      this.setState(prev => ({
        ...prev,
        form: { ...prev.form, category: -1 }
      }))
    }
    if (!this.props.context.categories.length) {
      ToastAndroid.show(
        'Kamu harus menambahkan kategori terlebih dahulu',
        ToastAndroid.SHORT
      )
      this.props.navigation.navigate('Category')
    }
  }

  getCategories = async () => {
    try {
      console.log(this.props.navigation.state.params, 'PARAMS')
      const items = await AsyncStorage.getItem(`${storageVersion}-category`)
      const categories = [...JSON.parse(items)]
      this.setState({ categories })
      console.log('cat', categories)
    } catch (error) {
      console.error(error)
      ToastAndroid.show('Error load categories!', ToastAndroid.SHORT)
    }
  }

  handleChange = (key, value) => {
    this.setState(prev => ({
      ...prev,
      form: { ...prev.form, [key]: value }
    }))
  }

  saveTask = async () => {
    if (this.state.form.title) {
      const local = [
        ...JSON.parse(await AsyncStorage.getItem(`${storageVersion}-list`))
      ]
      local.push({ ...this.state.form, id: Date.now() })
      await AsyncStorage.setItem(
        `${storageVersion}-list`,
        JSON.stringify(local)
      )
      this.props.navigation.navigate('Main')
    } else this.titleRef.focus()
  }

  render() {
    const {
      form: { title, desc, date, time, checklist, category, reminder }
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
            onChangeText={v => this.handleChange('title', v)}
          />
          <Input
            value={desc}
            style={input}
            containerStyle={inputContainer}
            label="Deskripsi"
            placeholder="Deskripsi Pengingat"
            multiline
            onChangeText={v => this.handleChange('desc', v)}
          />
          <DateTimePicker
            style={input}
            containerStyle={inputContainer}
            time={time}
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

const Reminder = props => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <CheckBox {...props} />
    <Text>Set alarm pengingat</Text>
  </View>
)

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
