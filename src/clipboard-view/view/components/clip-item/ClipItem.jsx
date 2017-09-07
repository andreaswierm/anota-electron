import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import { FavoriteButton } from './../'

import {
  Container,
  Footer,
  Header,
  Title,
} from './styles'

class ClipItem extends PureComponent {
  render() {
    const {
      createdAt,
      isFavorite,
      isFocused,
      onFocus,
      onSelect,
      title,
      onClickSetFavorite,
    } = this.props

    return (
      <Container
        isFocused={isFocused}
        onClick={onFocus}
        onDoubleClick={onSelect}
      >
        <Header>
          <Title isFocused={isFocused}>
            {title}
          </Title>

          {(isFocused || isFavorite) && (
            <FavoriteButton
              style={{flexShrink: 0}}
              value={isFavorite}
              onClick={onClickSetFavorite}
            />
          )}
        </Header>
        <Footer>
          <div>
            Created at {format(new Date(createdAt), 'HH:mm')}
          </div>

          {isFocused && (
            <div>
              Enter to copy
            </div>
          )}
        </Footer>
      </Container>
    )
  }
}

ClipItem.defaultProps = {
  title: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  isFocused: PropTypes.bool,
  createdAt: PropTypes.string,
  onFocus: PropTypes.func,
  isFavorite: PropTypes.bool,
  onClickSetFavorite: PropTypes.func,
}

export default ClipItem
