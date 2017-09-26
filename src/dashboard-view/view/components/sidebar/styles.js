import styled from 'styled-components'
import AlarmIcon from 'material-ui/svg-icons/action/alarm'
import { grey50, grey200, grey900 } from 'material-ui/styles/colors'

export const Container = styled.div`
  flex-shrink: 0;
  width: 200px;
  background-color: ${grey50};
  padding: 28px 0;
  overflow-y: scroll;
`

export const NavigationItem = styled.div`
  padding: 6px 8px;
  font-size: 14px;
  background-color: ${props => props.hasFocus ? grey200 : grey50};
  color: ${grey900};
  cursor: pointer;
  display: flex;
  align-items: center;
`

export const ReminderIcon = styled(AlarmIcon)`
  margin-right: 6px;
`
