import styled from 'styled-components'

export const Container = styled.div`
  height: 100vh;
  display: flex;
`

export const ContentContainer = styled.div`
  flex-grow: 1;
  overflow-y: scroll;
`

export const DraggableHeader = styled.div`
  -webkit-user-select: none;
  -webkit-app-region: drag;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 24px;
  z-index: 100;
`
