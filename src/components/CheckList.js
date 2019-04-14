import React, { Component } from 'react'
import { Button, View, Text, TextInput, TouchableOpacity } from 'react-native'
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
      this.props.onChange([...items, input])
      this.setState({ input: null })
    }
  }

  deleteItem = index => {
    const { items } = this.state
    items.splice(index, 1)
    this.props.onChange(items)
  }

  render() {
    const { input, items } = this.state
    return (
      <Input label="Checklist">
        {/* <Text>{JSON.stringify(this.state)}</Text> */}
        <View style={{ marginTop: 10 }}>
          {items.map((el, idx) => (
            <Item
              item={el}
              key={idx}
              index={idx}
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

const Item = ({ item, index, lastIndex, deleteItem }) => {
  const { icon, container, first, elseRow, last } = {
    icon: {
      color: '#aaa',
      fontSize: 15,
      fontWeight: '900',
      width: 50,
      textAlign: 'right',
      justifyContent: 'center',
      alignItems: 'center'
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderColor: '#aaa',
      borderWidth: 1
    },
    elseRow: {
      borderTopWidth: 0
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
      <Text>{item}</Text>
      <CloseBtn onPress={() => deleteItem(index)} />
    </View>
  )
}

export default CheckList
