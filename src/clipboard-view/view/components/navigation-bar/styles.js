import styled from 'styled-components'
import { grey300 } from 'material-ui/styles/colors'

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 8px 10px 8px 0;
`

export const SearchInput = styled.input`
  border: 1px solid ${grey300};
  border-radius: 4px;
  margin: 0 8px 0 0;
  padding: 0;
  height: 26px;
  flex-grow: 1;
  padding: 0 8px;
  font-size: 14px;

  &:focus {
    outline: none;
  }
`
