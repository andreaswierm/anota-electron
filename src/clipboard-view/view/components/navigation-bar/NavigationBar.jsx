import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FavoriteButton } from './../'

import {
  Container,
  SearchInput,
} from './styles'

class NavigationBar extends PureComponent {
  componentDidMount() {
    const { innerRef } = this.props

    if (innerRef && this.input) {
      innerRef(this.input)
    }
  }

  onChangeSearchTerm = event => {
    this.props.onSearch(event.target.value)
  }

  render() {
    const {
      isFilterFavorite,
      onClickFavorite,
      searchTerm,
    } = this.props

    return (
      <Container>
        <SearchInput
          innerRef={(ref) => this.input = ref}
          placeholder="What do you wanna find?"
          onChange={this.onChangeSearchTerm}
          value={searchTerm}
        />

        <FavoriteButton value={isFilterFavorite} onClick={onClickFavorite} />
      </Container>
    )
  }
}

NavigationBar.propTypes = {
  innerRef: PropTypes.func,
  onSearch: PropTypes.func.isRequired,
  onClickFavorite: PropTypes.func.isRequired,
  isFilterFavorite: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string,
}

export default NavigationBar
