import React, { createContext } from 'react'

const context = createContext()
export const Provider = context.Provider
export const Consumer = context.Consumer
export const ConsumerProps = WrappedComponent => props => (
  <Consumer>{v => <WrappedComponent {...props} context={v} />}</Consumer>
)
