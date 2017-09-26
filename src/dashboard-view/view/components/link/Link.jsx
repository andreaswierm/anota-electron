import styled from 'styled-components'
import { blue500 } from 'material-ui/styles/colors'

const Link = styled.a`
  color: ${blue500};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export default Link
