import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { grey900 } from 'material-ui/styles/colors'

import {
  Container,
  NavigationItem,
  ReminderIcon,
} from './styles'

class Sidebar extends PureComponent {
  render() {
    const { pathname } = this.props

    return (
      <Container>
        <NavigationItem hasFocus={pathname === '/'}>
          <ReminderIcon
            width={20}
            height={20}
            style={{
              color: grey900,
              width: '20px',
              height: '20px',
            }}
          />
          Reminders
        </NavigationItem>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  pathname: state.routing.locationBeforeTransitions.pathname,
})

export default connect(mapStateToProps)(Sidebar)
