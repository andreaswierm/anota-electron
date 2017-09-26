import React, { PureComponent } from 'react'
import configureStore from './../../redux/configuration'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { ipcRenderer } from 'electron'

import {
  hashHistory,
  Route,
  Router,
} from 'react-router'

import {
  Layout,
  Reminders,
} from './components'

const store = configureStore(null, 'renderer');
const history = syncHistoryWithStore(hashHistory, store);

export default class App extends PureComponent {
  componentDidMount() {
    window.addEventListener('keydown', this.onWindowKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onWindowKeyDown)
  }

  onWindowKeyDown = event => {
    // Escape key
    if (event.keyCode === 27) {
      ipcRenderer.send('onHideClipboardView')
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <Provider store={store}>
          <Router history={history}>
            <Route component={Layout}>
              <Route path="/" component={Reminders} />
            </Route>
          </Router>
        </Provider>
      </MuiThemeProvider>
    )
  }
}
