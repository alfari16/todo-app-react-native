import React, { forwardRef, PureComponent } from 'react'
import { View, TextInput, Text } from 'react-native'
import { BLUE } from '../util/color'

class Input extends PureComponent {
  state = {
    isFocus: false
  }

  containerStyle = {
    marginBottom: this.props.disableMargin ? 0 : 15,
    borderColor: '#aaa',
    borderBottomWidth: this.props.useBorder ? 1 : 0
  }

  _resetFocus = () => {
    this.setState({ isFocus: !this.state.isFocus })
  }

  render() {
    const { label, children, innerRef, containerStyle, style } = this.props
    return (
      <View style={[this.containerStyle, containerStyle]}>
        {label && <Text>{label}</Text>}
        {children || (
          <TextInput
            onFocus={this._resetFocus}
            onBlur={this._resetFocus}
            ref={innerRef}
            {...this.props}
            style={[
              style,
              { borderColor: this.state.isFocus ? BLUE : style.borderColor }
            ]}
          />
        )}
      </View>
    )
  }
}

export default forwardRef((props, ref) => <Input {...props} innerRef={ref} />)
