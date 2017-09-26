import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Container, Input }  from './styles'
import Checkbox from 'material-ui/Checkbox'

class ReminderItem extends PureComponent {
  state = {
    value: this.props.value,
  }

  handleOnChangeInput = event => {
    const value = event.target.value

    this.setState({ value })
  }

  handleOnBlurInput = () => {
    const { value } = this.state
    const { onChange } = this.props

    onChange(value)
  }

  handleInnerRef = ref => {
    const { innerRef } = this.props
    this.inputRef = ref

    if (innerRef) {
      innerRef(ref)
    }
  }

  render() {
    const { value } = this.state
    const { onCheck, isChecked, autoFocus } = this.props

    return (
      <Container>
        <Checkbox
          onCheck={onCheck}
          checked={isChecked}
          style={{
            width: '24px',
            marginRight: '-16px',
          }}
        />
        <Input
          lineThrough={isChecked}
          innerRef={this.handleInnerRef}
          autoFocus={autoFocus}
          type="text"
          onChange={this.handleOnChangeInput}
          value={value}
          onBlur={this.handleOnBlurInput}
        />
      </Container>
    )
  }
}

ReminderItem.defaultProps = {
  autoFocus: false,
  value: '',
  isChecked: false,
}

ReminderItem.propTypes = {
  onChange: PropTypes.func.isRequired,
  onCheck: PropTypes.func.isRequired,
  innerRef: PropTypes.func,
  isChecked: PropTypes.bool,
  autoFocus: PropTypes.bool,
  value: PropTypes.string,
}

export default ReminderItem
