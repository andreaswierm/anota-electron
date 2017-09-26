import * as reminderActions from './../../../../redux/reminder/actions'
import _ from 'lodash'
import compareDesc from 'date-fns/compare_desc'
import format from 'date-fns/format'
import Header from './header/Header'
import React, { Component } from 'react'
import ReminderItem from './reminder-item/ReminderItem'
import { connect } from 'react-redux'
import { Container } from './styles'
import differenceInDays from 'date-fns/difference_in_days'

class Reminders extends Component {
  state = {
    isEditMode: false,
  }

  handleOnClickAdd = () => {
    this.setState(({ isEditMode }) => ({ isEditMode: !isEditMode }))
  }

  handleCreate = value => {
    const { createReminder } = this.props

    if (!value.length) {
      return
    }

    createReminder({ value }).then(() => {
      this.setState({ isEditMode: false })
    })
  }

  handleOnUpdate = reminder => value => {
    const { updateReminder } = this.props

    if (!value.length) {
      return
    }

    reminder.value = value

    updateReminder(reminder)
  }

  handleOnCheck = reminder => () => {
    const { setReminderDone } = this.props

    // reminder.isDone = !reminder.isDone

    setReminderDone(reminder, !reminder.doneAt)
  }

  getHeaderTitle = date => {
    const diffInDays = differenceInDays(new Date(), date)
    let title

    if (diffInDays === 0) {
      title = 'Today'
    } else if (diffInDays === 1) {
      title = 'Yesterday'
    } else {
      title = format(date, 'Do MMM')
    }

    return {
      title,
      diffInDays,
    }
  }

  render() {
    return (
      <Container>
        {this.props.reminders.length ? _.chain(this.props.reminders)
          .groupBy((reminder) => {
            const date = !!reminder.doneAt ? new Date(reminder.doneAt) : new Date()

            return format(date, 'YYYY-MM-DD')
          })
          .toPairs()
          .sort((group1, group2) => {
            const date1 = group1[0] !== '0' ? new Date(group1[0]) : new Date()
            const date2 = group2[0] !== '0' ? new Date(group2[0]) : new Date()

            return compareDesc(date1, date2)
          })
          .map((group) => {
            const date = group[0] !== '0' ? new Date(group[0]) : new Date()
            const reminders = group[1]

            return this.renderDay(date, reminders)
          })
          .value()
        : this.renderDay(new Date(), [])
        }
      </Container>
    )
  }

  renderDay = (date, reminders) => {
    const { isEditMode } = this.state
    const { title, diffInDays } = this.getHeaderTitle(date)

    return (
      <div key={format(date)}>
        <Header
          title={title}
          showAddButton={diffInDays === 0}
          onClickAdd={this.handleOnClickAdd}
        />

        {_.map(reminders, (reminder) => (
          <ReminderItem
            key={reminder.id}
            value={reminder.value}
            isChecked={!!reminder.doneAt}
            onCheck={this.handleOnCheck(reminder)}
            onChange={this.handleOnUpdate(reminder)}
          />
        ))}

        {isEditMode && diffInDays === 0 && (
          <ReminderItem
            autoFocus
            onCheck={() => null}
            onChange={this.handleCreate}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  reminders: _.map(state.REMINDER.collection),
})

const mapActionsToProps = dispatch => ({
  createReminder: payload => dispatch(reminderActions.create(payload)),
  setReminderDone: (payload, isDone) => dispatch(reminderActions.setDone(payload, isDone)),
  updateReminder: payload => dispatch(reminderActions.update(payload)),
})

export default connect(mapStateToProps, mapActionsToProps)(Reminders)
