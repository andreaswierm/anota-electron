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
  -webkit-app-region: drag;
  -webkit-user-select: none;
  height: 24px;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 100;
`
