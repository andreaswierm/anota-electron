import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from './../../'
import { Container, Title } from './styles'

class Header extends PureComponent {
  render() {
    const {
      title,
      onClickAdd,
      showAddButton,
    } = this.props

    return (
      <Container>
        <Title>
          {title}
        </Title>

        {showAddButton && <Link onClick={onClickAdd}>
          Add
        </Link>}
      </Container>
    )
  }
}

Header.defaultProps = {
  onClickAdd: () => null,
  showAddButton: false,
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  onClickAdd: PropTypes.func,
  showAddButton: PropTypes.bool,
}

export default Header
