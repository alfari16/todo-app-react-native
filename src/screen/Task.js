import React, { PureComponent } from 'react'
import { Text } from 'react-native'
import Container from '../components/Container'
import { withNavigation } from 'react-navigation'

class Task extends PureComponent {
  render() {
    const data = this.props.navigation.getParam('data', {})
    return (
      <Container>
        <Text>{data.id}</Text>
        <Text>{JSON.stringify(data)}</Text>
      </Container>
    )
  }
}

export default withNavigation(Task)
