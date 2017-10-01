import styled from 'styled-components'
import { grey600, grey900 } from 'material-ui/styles/colors'

export const Container = styled.div`
  ${props => props.lineThrough && 'text-decoration: line-through;'}
  color: ${props => props.lineThrough ? grey600 : grey900};

`

export const CheckboxInput = styled.input`
  float: left;
  position: relative;
  top: 0px;
  left: -2px;
`
