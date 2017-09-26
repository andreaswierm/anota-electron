import styled from 'styled-components'

export const Container = styled.div`
  align-items: center;
  display: flex;
  padding: 0 4px;
`

export const Input = styled.input`
  align-items: center;
  border: 0;
  flex-grow: 1;
  font-size: 14px;
  height: 26px;
  padding: 0 4px;
  ${props => props.lineThrough && 'text-decoration: line-through;'}

  &:focus{
    outline: none;
  }
`
