import styled from 'styled-components'
import { grey600, grey900 } from 'material-ui/styles/colors'

export const Container = styled.div`
  padding: 0 26px 28px;
`

export const DoneReminder = styled.div`
  padding-left: 18px;
  color: ${grey600};
  text-decoration: line-through;

  &:hover {
    text-decoration: none;
    color: ${grey900};
  }
`
