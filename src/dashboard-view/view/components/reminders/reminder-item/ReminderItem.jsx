import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Container, CheckboxInput }  from './styles'
import Checkbox from 'material-ui/Checkbox'
import { EditorBlock, EditorState } from 'draft-js'

class ReminderItem extends PureComponent {
  handleOnChangeInput = () => {
    const { block, blockProps } = this.props;

    const { onChange, getEditorState } = blockProps;
    const data = block.getData();
    const checked = (data.has('checked') && data.get('checked') === true);
    const newData = data.set('checked', !checked);

    const editorState = getEditorState()

    const contentState = editorState.getCurrentContent()
    const newBlock = block.merge({
      data: newData,
    })
    const newContentState = contentState.merge({
      blockMap: contentState.getBlockMap().set(block.getKey(), newBlock),
    })
    onChange(EditorState.push(editorState, newContentState, 'change-block-type'))

  }

  render() {
    const data = this.props.block.getData()

    const checked = data.get('checked') === true;

    const editorBlockProps = {
      ...this.props,
      autoFocus: true,
    }

    return (
      <Container lineThrough={checked}>
        <CheckboxInput
          type="checkbox"
          checked={checked}
          onChange={this.handleOnChangeInput}
        />
        <EditorBlock {...editorBlockProps} />
      </Container>
    )
  }
}

export default ReminderItem
