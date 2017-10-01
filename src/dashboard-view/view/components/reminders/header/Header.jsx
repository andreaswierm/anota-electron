import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Container, Title } from './styles'

class Header extends PureComponent {
  render() {
    const { title } = this.props

    return (
      <Container>
        <Title>
          {title}
        </Title>
      </Container>
    )
  }
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
}

export default Header
