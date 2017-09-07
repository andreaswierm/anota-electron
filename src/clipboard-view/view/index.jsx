import React, { PureComponent } from 'react'
import configureStore from './../../redux/configuration'
import { Provider } from 'react-redux'
import { Dashboard } from './components'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const store = configureStore(null, 'renderer');

export default class App extends PureComponent {
  render() {
    return (
      <MuiThemeProvider>
        <Provider store={store}>
          <Dashboard />
        </Provider>
      </MuiThemeProvider>
    )
  }
}
