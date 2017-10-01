import * as reminderActions from './../../../../redux/reminder/actions'
import _ from 'lodash'
import compareDesc from 'date-fns/compare_desc'
import format from 'date-fns/format'
import Header from './header/Header'
import React, { Component } from 'react'
import ReminderItem from './reminder-item/ReminderItem'
import { connect } from 'react-redux'
import { Container, DoneReminder } from './styles'
import differenceInDays from 'date-fns/difference_in_days'
import { Map, List } from 'immutable'
import { ObjectID } from 'mongodb'

import {
  Editor,
  EditorState,
  convertToRaw,
  ContentBlock,
  ContentState,
  convertFromRaw,
  genKey,
} from 'draft-js'

const blockRenderMap = Map({
  'unstyled': {
    element: 'div',
  }
});

class Reminders extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editorState: this.generateEditorState(this.props.reminders),
    }
  }

  componentDidMount() {
    this.refs.editor.focus()

    window.addEventListener('focus', this.onWindowFocus)
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.onWindowFocus)

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reminders.length !== this.props.reminders.length) {
      this.setState({ editorState: this.generateEditorState(nextProps.reminders) })
    }
  }

  onWindowFocus = () => {
    this.refs.editor.focus()
    this.handleOnBlur()
  }

  onChange = editorState => {
    const emptyTasks = editorState
      .getCurrentContent()
      .get('blockMap')
      .filter(block => !block.get('text', '').length)

    if (emptyTasks.size > 1) {
      editorState = EditorState.undo(editorState)
    }

    this.setState({ editorState })
  }

  handleOnBlur = () => {
    const { saveRemindersState } = this.props

    const blocks = convertToRaw(this.state.editorState.getCurrentContent())
      .blocks
      .map(block => ({
        id: new ObjectID().toString(),
        content: block.text,
        isDone: !!block.data.checked,
        doneAt: !!block.data.checked ? (block.data.doneAt ? block.data.doneAt : new Date()) : null,
      }))

    saveRemindersState(blocks)
  }

  generateEditorState = reminders => {
    if (!!reminders.length) {
      return (
        EditorState.createWithContent(convertFromRaw({
          entityMap: {},
          blocks: _.map(reminders, reminder => ({
            text: reminder.content,
            data: {
              checked: reminder.isDone,
              doneAt: reminder.doneAt,
            },
          }))
        }))
      )
    }

    return EditorState.createEmpty()
  }

  getEditorState = () => {
    return this.state.editorState
  }

  getHeaderTitle = date => {
    const diffInDays = differenceInDays(new Date(), date)

    if (diffInDays === 1) {
      return 'Yesterday'
    }

    return format(date, 'Do MMM')
  }

  blockRenderer = contentBlock => {
    const type = contentBlock.getType();
    if (type === 'unstyled') {
      return {
        component: ReminderItem,
        editable: true,
        props: {
          getEditorState: this.getEditorState,
          onChange: this.onChange,
        },
      };
    }
  }

  render() {
    const doneReminders = _.chain(this.props.doneReminders)
      .groupBy(reminder => format(new Date(reminder.doneAt), 'YYYY-MM-DD'))
      .toPairs()
      .sort((group1, group2) => {
        return compareDesc(new Date(group1[0]), new Date(group2[0]))
      })
      .map((group, index) => {
        const date = group[0] !== '0' ? new Date(group[0]) : new Date()
        const reminders = group[1]

        return (
          <div key={date}>
            <Header title={this.getHeaderTitle(date)} />

            {_.map(reminders, (reminder, index) => (
              <DoneReminder key={index}>
                {reminder.content}
              </DoneReminder>
            ))}
          </div>
        )
      })
      .value()

    return (
      <Container>
        <Header title="Today" />
        <Editor
          ref="editor"
          editorState={this.state.editorState}
          onChange={this.onChange}
          blockRendererFn={this.blockRenderer}
          blockRenderMap={blockRenderMap}
          onBlur={this.handleOnBlur}
        />

        {doneReminders}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  reminders: _.map(state.REMINDER.collection),
  doneReminders: _.map(state.REMINDER.doneCollection),
})

const mapActionsToProps = dispatch => ({
  saveRemindersState: payload => dispatch(reminderActions.createState(payload)),
})

export default connect(mapStateToProps, mapActionsToProps)(Reminders)
