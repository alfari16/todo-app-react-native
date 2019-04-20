import React, { Component } from 'react'
import {
  Picker,
  View,
  ToastAndroid,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native'

import Container from './Container'
import Input from './Input'
import DateTimePicker from './DateTimePicker'
import CheckList from './CheckList'
import Button from './Button'
import Reminder from './Reminder'

import { BLUE, DARK_RED, DARK_ORANGE } from '../util/color'
import { ConsumerProps } from '../util/context.js'

class NewTask extends Component {
  state = {
    form: {
      id: Date.now(),
      title: null,
      desc: null,
      date: new Date(),
      checklist: [],
      category: null,
      reminder: false,
      ...this.props.navigation.getParam('data', {})
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

  handleChange = (key, value) => {
    this.setState(prev => ({
      ...prev,
      form: { ...prev.form, [key]: value }
    }))
  }

  saveTask = async () => {
    if (this.state.form.title) {
      this.props.context._addTask(this.state.form)
      this.props.navigation.navigate('Main')
    } else this.titleRef.focus()
  }

  isCompletable = () => {
    const { button, child, container, outer, outerContainer } = {
      button: {
        width: (Dimensions.get('screen').width - 30) / 2
      },
      child: { textAlign: 'center', color: 'white' },
      container: {
        flexDirection: 'row',
        borderRadius: 25,
        overflow: 'hidden'
      },
      outer: {
        backgroundColor: '#eee',
        paddingVertical: 25
      },
      outerContainer: {
        paddingTop: 0,
        backgroundColor: 'transparent'
      }
    }
    const removeTask = () => {
      Alert.alert(
        'Apakah kamu yakin?',
        `Ingin menghapus ${this.state.form.title}?`,
        [
          { text: 'Tidak' },
          {
            text: 'Ya',
            onPress: () => {
              this.props.context._removeTask(this.state.form.id)
              this.props.navigation.goBack()
            }
          }
        ]
      )
    }
    const editState = () =>
      this.setState(prev => ({
        ...prev,
        form: {
          ...prev.form,
          isComplete: !prev.form.isComplete
        }
      }))
    return this.props.isCompletable ? (
      <View style={outer}>
        <Container style={outerContainer}>
          <View style={container}>
            {this.state.form.isComplete ? (
              <Button
                childStyle={child}
                style={[button, { backgroundColor: DARK_ORANGE }]}
                onPress={() => {
                  this.props.context._setList({
                    id: this.state.form.id,
                    value: false
                  })
                  editState()
                }}
              >
                Tandai Belum Selesai
              </Button>
            ) : (
              <Button
                childStyle={child}
                style={[button, { backgroundColor: BLUE }]}
                onPress={() => {
                  this.props.context._setList({
                    id: this.state.form.id,
                    value: true
                  })
                  editState()
                }}
              >
                Tandai Selesai
              </Button>
            )}
            <Button
              childStyle={child}
              style={[button, { backgroundColor: DARK_RED }]}
              onPress={removeTask}
            >
              Hapus
            </Button>
          </View>
        </Container>
      </View>
    ) : null
  }

  render() {
    const {
      form: { title, desc, date, time, checklist, category, reminder }
    } = this.state
    const { input, button, btnWrapper, inputContainer } = style

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {this.isCompletable()}
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
            label="Set alarm pengingat"
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
