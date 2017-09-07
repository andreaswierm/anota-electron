import styled from 'styled-components'
import { grey600, grey200, grey50 } from 'material-ui/styles/colors'

export const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  padding-bottom: 26px;
`

export const Header = styled.div`
  padding-left: 8px;
  background-color: ${grey50};
  border: 1px solid ${grey200};
`

export const TitleBar = styled.div`
  align-items: flex-end;
  color: ${grey600};
  display: flex;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 100;
  height: 20px;
  justify-content: center;
`

export const Content = styled.div`
  overflow-y: scroll;
`

export const NoResults = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px 0;
  width: 100%;
`
