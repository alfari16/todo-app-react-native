import React, { Fragment, PureComponent } from 'react'
import { Text } from 'react-native'
import Form from '../components/Form'

export default class Task extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('data', {}).title
    }
  }

  render() {
    const data = this.props.navigation.getParam('data', {})
    return <Form {...this.props} isCompletable data={data} />
  }
}
