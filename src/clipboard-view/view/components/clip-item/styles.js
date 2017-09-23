import styled from 'styled-components'
import { grey100, grey500, grey900 } from 'material-ui/styles/colors'
import MaterialPaper from 'material-ui/Paper';

export const Container = styled.div`
  padding: 14px 8px;
  opacity: ${props => props.isFocused ? 1 : 0.7}
`

export const Paper = styled(MaterialPaper)`
  border-radius: 6px;
`

export const Content = styled.div`
  font-size: 12px;
  font-weight: bold;
  padding: 4px;
  border-top: 1px solid ${grey100};
  border-bottom: 1px solid ${grey100};
  height: 60px;
  overflow-y: hidden;
`

export const Footer = styled.div`
  color: ${grey500};
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  padding: 4px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
`

export const Title = styled.div`
  color: ${grey900};
  line-height: 24px;
  overflow: hidden;
  padding-right: 6px;
  text-overflow: ellipsis;
  white-space: nowrap;
`
