import React, { Component } from 'react'
import { CheckBox, View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
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
              showCheck={this.props.showCheck}
            />
          ))}
        </View>
        {!this.props.showCheck && (
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
              <Icon name="plus" size={35} />
            </TouchableOpacity>
          </View>
        )}
      </Input>
    )
  }
}

const Item = ({
  item,
  index,
  lastIndex,
  deleteItem,
  completeCheck,
  showCheck
}) => {
  const { container, isShowCheck, text, checkbox, first, elseRow, last } = {
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
      marginLeft: 5
    },
    isShowCheck: {
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
      {showCheck && (
        <CheckBox
          value={item.isComplete}
          style={checkbox}
          onValueChange={value => completeCheck(index, value)}
        />
      )}
      <Text style={[text, showCheck && isShowCheck]}>{item.text}</Text>
      {!showCheck && <CloseBtn onPress={() => deleteItem(index)} />}
    </View>
  )
}

export default CheckList
