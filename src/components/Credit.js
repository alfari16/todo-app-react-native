import React, { memo } from 'react'
import { View, Text, Linking, ToastAndroid } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import Modal from './Modal'
import Button from './Button'
import { DARK_RED, BLUE } from '../util/color'

const BIO = [
  { url: 'https://github.com/alfari16', name: 'sc-github' },
  { url: 'https://www.linkedin.com/in/alifirfananshory/', name: 'sc-linkedin' },
  { url: 'https://instagram.com/alfari16', name: 'sc-facebook' }
]

const Credit = props => {
  setTimeout(() => {
    ToastAndroid.show('Tekan icon untuk detail', ToastAndroid.SHORT)
  }, 1000)
  return (
    <Modal {...props} title="Tentang aplikasi" disableFooter>
      <Icon name="user" style={styles.text} size={80} />
      <Text style={styles.text}>
        Made with <Icon name="heart" color={DARK_RED} size={20} /> from Malang,
        Indonesia
      </Text>
      <View style={styles.container}>
        {BIO.map(el => (
          <Icon
            key={el.name}
            name={el.name}
            size={60}
            style={styles.icon}
            color={BLUE}
            onPress={() => Linking.openURL(el.url)}
          />
        ))}
      </View>
      <Button onPress={props.closeModal}>Tutup</Button>
    </Modal>
  )
}

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  icon: {
    marginHorizontal: 10,
    marginBottom: 10
  },
  text: {
    textAlign: 'center',
    marginTop: 10
  }
}

export default memo(Credit)
