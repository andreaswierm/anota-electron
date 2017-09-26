import React, { PureComponent } from 'react'
import { Sidebar } from './../'

import {
  Container,
  ContentContainer,
  DraggableHeader,
} from './styles'

class Layout extends PureComponent {
  render() {
    return (
      <Container>
        <DraggableHeader />
        <Sidebar />

        <ContentContainer>
          {this.props.children}
        </ContentContainer>
      </Container>
    )
  }
}

export default Layout
