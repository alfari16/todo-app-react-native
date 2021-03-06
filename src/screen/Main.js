import React, { Component, memo } from 'react'
import { View, Text, TouchableOpacity, FlatList, Button } from 'react-native'
import TodoList from '../components/TodoList'
import Container from '../components/Container'
import Credit from '../components/Credit'
import { ConsumerProps } from '../util/context.js'
import { BLUE, LIGHT_BLUE } from '../util/color'

class Main extends Component {
  state = {
    category: 'Semua',
    visibility: false
  }

  componentDidUpdate() {
    if (this.props.context.addTaskState) {
      this.props.navigation.navigate('NewTask')
      this.props.context._setAddTaskState(false)
    }
  }

  navigateToNewTask = () => {
    this.props.navigation.navigate('NewTask')
  }

  changeHeader = category => this.setState({ category })

  filteredCategories = () =>
    this.props.context.list
      .map(el => el.category)
      .filter((el, idx, self) => self.indexOf(el) === idx)

  render() {
    return (
      <Container>
        <Header
          onChange={this.changeHeader}
          categories={this.filteredCategories()}
          activated={this.state.category}
        />
        <TodoList
          list={this.props.context.list}
          activeCategory={this.state.category}
        />
        {this.props.context.creditPanel ? (
          <Credit
            transparent
            animationType="slide"
            onDismiss={this.props.context._setCreditPanel}
            closeModal={this.props.context._setCreditPanel}
            visible={this.props.context.creditPanel}
          />
        ) : null}
      </Container>
    )
  }
}

const Header = ({ onChange, activated, categories }) => {
  const style = {
    marginBottom: 10
  }
  categories = ['Semua', ...categories]
  return (
    <View style={style}>
      <FlatList
        horizontal
        data={categories}
        renderItem={data => (
          <HeaderItem
            activated={activated}
            title={data.item}
            onPress={onChange}
          />
        )}
        keyExtractor={data => data.toString()}
      />
    </View>
  )
}
const HeaderItem = memo(({ title, onPress, activated }) => {
  const { text, container } = {
    text: {
      color: 'white'
    },
    container: {
      borderRadius: 25,
      marginRight: 7,
      paddingVertical: 7,
      paddingHorizontal: 23,
      backgroundColor: activated === title ? LIGHT_BLUE : BLUE
    }
  }
  const onPressHandler = () => onPress(title)
  return (
    <TouchableOpacity onPress={onPressHandler}>
      <View style={container}>
        <Text style={text}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
})

export default ConsumerProps(Main)
