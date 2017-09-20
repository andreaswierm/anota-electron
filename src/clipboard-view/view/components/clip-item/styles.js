import styled from 'styled-components'
import { lightBlue50, grey500, grey900 } from 'material-ui/styles/colors'

export const Container = styled.div`
  padding: 12px;
  background-color: ${props => props.isFocused ? lightBlue50 : 'transparent'};
`

export const Footer = styled.div`
  color: ${grey500};
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  margin-top: 4px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Title = styled.div`
  color: ${grey900};
  line-height: 24px;
  overflow: hidden;
  padding-right: 6px;
  text-overflow: ellipsis;
  white-space: nowrap;
`
