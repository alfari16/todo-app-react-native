import React, { PureComponent } from 'react'
import {
  Text,
  Modal,
  View,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'
import Card from './Card'
import Button from './Button'

class ModalCustom extends PureComponent {
  render() {
    const { container, card, titleStyle, action, buttonCancel } = {
      container: {
        backgroundColor: 'rgba(0,0,0,.5)',
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center'
      },
      titleStyle: {
        fontSize: 18,
        marginBottom: 10
      },
      card: {
        maxWidth: Dimensions.get('screen').width - 50,
        width: 350,
        padding: 20,
        paddingBottom: 10,
        elevation: 5
      },
      action: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
      },
      buttonCancel: {
        color: '#999'
      }
    }
    const { onDismiss, disableFooter, children, title, onSave } = this.props

    return (
      <Modal {...this.props}>
        <TouchableWithoutFeedback onPress={onDismiss}>
          <View style={container}>
            <Card style={card}>
              <Text style={titleStyle}>{title}</Text>
              <View>{children}</View>
              {!disableFooter && (
                <View style={action}>
                  <Button onPress={onDismiss} childStyle={buttonCancel}>
                    Batal
                  </Button>
                  <Button onPress={onSave}>Simpan</Button>
                </View>
              )}
            </Card>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

export default ModalCustom
