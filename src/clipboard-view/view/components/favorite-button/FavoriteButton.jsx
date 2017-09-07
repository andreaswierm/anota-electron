import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import StarBorder from 'material-ui/svg-icons/toggle/star-border'
import Star from 'material-ui/svg-icons/toggle/star'
import { yellow800, grey500 } from 'material-ui/styles/colors'
import { Button } from './styles'

class FavoriteButton extends PureComponent {
  onClickButton = event => {
    event.preventDefault()
    event.stopPropagation()

    this.props.onClick()
  }

  render() {
    const { value, style } = this.props

    return (
      <Button
        style={{
          padding: '0',
          margin: '-12px',
          ...style,
        }}
        onClick={this.onClickButton}
      >
        {!!value ? <Star color={yellow800} /> : <StarBorder color={grey500} />}
      </Button>
    )
  }
}

FavoriteButton.defaultProps = {
  onClick: () => null,
}

FavoriteButton.propTypes = {
  style: PropTypes.object,
  value: PropTypes.bool,
  onClick: PropTypes.func,
}

export default FavoriteButton
