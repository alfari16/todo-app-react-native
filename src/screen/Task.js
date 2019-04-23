import React, { Fragment, PureComponent } from 'react'
import { Text, View } from 'react-native'

import Form from '../components/Form'
import Container from '../components/Container'
import Card from '../components/Card'

export default class Task extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('data', {}).title
    }
  }

  render() {
    const data = this.props.navigation.getParam('data', {})
    return (
      <Container>
        <Card>
          <Text>{JSON.stringify(data)}</Text>
        </Card>
      </Container>
    )
  }
}

const Status = ({ isComplete, date }) => {
  return <View style={container} />
}
