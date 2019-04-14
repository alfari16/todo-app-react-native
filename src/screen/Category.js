import React, { Component, memo, Fragment } from 'react'
import { Text, View, FlatList, TouchableWithoutFeedback } from 'react-native'
import { ConsumerProps } from '../util/context'
import Container from '../components/Container'
import Card from '../components/Card'
import Modal from '../components/Modal'
import Input from '../components/Input'
import CloseBtn from '../components/CloseBtn'

class Category extends Component {
  state = {
    modal: {
      visibility: false,
      title: null,
      value: null,
      id: null
    },
    selectedCategoryId: 0
  }
  saveEditing = () => {
    const { _setCategory } = this.props.context
    const {
      modal: { value, id }
    } = this.state
    _setCategory({ value, id })
    this.closeModal()
  }
  createCategory = () => {
    this.props.context._addCategory(this.state.modal.value)
    this.closeModal()
    setTimeout(() => {
      this.forceUpdate()
    }, 500)
  }
  deleteCategory = id => this.props.context._removeCategory(id)

  closeModal = () => {
    this.props.context._setAddCategoryState(false)
    this.setState(prev => ({
      ...prev,
      modal: {
        visibility: false
      }
    }))
  }

  render() {
    const { categories, addCategoryState } = this.props.context
    const {
      modal: { visibility, title, value }
    } = this.state
    const { input, miniLabel } = style

    return (
      <Fragment>
        <Container>
          <FlatList
            data={categories}
            keyExtractor={data => data.id.toString()}
            renderItem={data => (
              <Item
                name={data.item.name}
                onDelete={() => this.deleteCategory(data.item.id)}
                onPress={() =>
                  this.setState(prev => ({
                    ...prev,
                    modal: {
                      visibility: !prev.modal.visibility,
                      title: 'Edit Kategori',
                      value: data.item.name,
                      id: data.item.id
                    }
                  }))
                }
              />
            )}
          />
        </Container>
        <Modal
          animationType="fade"
          transparent
          title={addCategoryState ? 'Tambah Kategori' : title}
          onDismiss={this.closeModal}
          onSave={addCategoryState ? this.createCategory : this.saveEditing}
          visible={visibility || addCategoryState}
        >
          <Input
            value={value}
            autoFocus
            style={input}
            onChangeText={value =>
              this.setState(prev => ({
                ...prev,
                modal: {
                  ...prev.modal,
                  value
                }
              }))
            }
          />
          {addCategoryState && (
            <Text style={miniLabel}>Misal: Mata kuliah, Kerja, dll</Text>
          )}
        </Modal>
      </Fragment>
    )
  }
}

const Item = memo(({ name, onPress, onDelete }) => {
  const { container } = {
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }
  return (
    <Card onPress={onPress}>
      <View style={container}>
        <Text>{name}</Text>
        <CloseBtn onPress={onDelete} />
      </View>
    </Card>
  )
})

const style = {
  input: {
    borderColor: '#aaa',
    borderRadius: 5,
    borderWidth: 0.5,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 0
  },
  miniLabel: {
    color: '#bbb',
    marginTop: 5,
    fontSize: 12
  }
}

export default ConsumerProps(Category)
