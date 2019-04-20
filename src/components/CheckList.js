import React, { Component } from 'react'
import { CheckBox, View, Text, TouchableOpacity } from 'react-native'
import Input from './Input'
import CloseBtn from './CloseBtn'

class CheckList extends Component {
  state = { input: null, items: [] }

  static getDerivedStateFromProps(props) {
    return {
      items: props.items
    }
  }

  addItem = () => {
    const { input, items } = this.state
    if (input) {
      this.props.onChange([...items, { text: input, isComplete: false }])
      this.setState({ input: null })
    }
  }

  deleteItem = index => {
    const { items } = this.state
    items.splice(index, 1)
    this.props.onChange(items)
  }

  changeChecklist = (index, value) => {
    const { items } = this.state
    items[index].isComplete = value
    this.props.onChange(items)
  }

  render() {
    const { input, items } = this.state
    console.log(items, 'item')
    return (
      <Input label="Checklist">
        <View style={{ marginTop: 10 }}>
          {items.map((el, idx) => (
            <Item
              item={el}
              key={idx}
              index={idx}
              completeCheck={this.changeChecklist}
              lastIndex={items.length - 1}
              deleteItem={this.deleteItem}
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Input
            value={input}
            containerStyle={{ flex: 1, marginRight: 20 }}
            style={{ borderBottomWidth: 1, borderColor: '#aaa' }}
            onChangeText={input => this.setState({ input })}
            returnKeyType="done"
            onSubmitEditing={this.addItem}
            placeholder="Tambah checklist"
            disableMargin
          />
          <TouchableOpacity onPress={this.addItem} disabled={!input}>
            <Text
              style={{
                color: !!input ? '#333' : '#aaa',
                marginTop: 5
              }}
            >
              Tambah
            </Text>
          </TouchableOpacity>
        </View>
      </Input>
    )
  }
}

const Item = ({ item, index, lastIndex, deleteItem, completeCheck }) => {
  const { container, text, checkbox, first, elseRow, last } = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderColor: '#aaa',
      borderWidth: 1
    },
    elseRow: {
      borderTopWidth: 0
    },
    text: {
      flex: 1,
      marginLeft: 5,
      textDecorationLine: item.isComplete ? 'line-through' : 'none'
    },
    first: {
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5
    },
    last: {
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5
    }
  }
  return (
    <View
      style={[
        container,
        index === 0 || elseRow,
        index !== 0 || first,
        index !== lastIndex || last
      ]}
    >
      <CheckBox
        value={item.isComplete}
        style={checkbox}
        onValueChange={value => completeCheck(index, value)}
      />
      <Text style={text}>{item.text}</Text>
      <CloseBtn onPress={() => deleteItem(index)} />
    </View>
  )
}

export default CheckList
