import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Map } from 'immutable'
import { clipboard, ipcRenderer } from 'electron'
import { NavigationBar, ClipItem } from './../'
import { Provider, connect } from 'react-redux'
import _ from 'lodash'
import compareDesc from 'date-fns/compare_desc'
import * as clipboardActions from './../../../../redux/clipboard/actions'

import {
  Container,
  Header,
  TitleBar,
  Content,
  NoResults,
} from './styles'

class Dashboard extends Component {
  state = {
    clipFocusIndex: 0,
    searchTerm: '',
    showFavorites: false,
  }

  elementsPosition = {}

  componentDidMount() {
    window.addEventListener('focus', this.onWindowFocus)
    window.addEventListener('blur', this.onWindowBlur)
    window.addEventListener('keydown', this.onWindowKeyDown)
    window.addEventListener('click', this.onWindowOnClick)

    this.buildElementsPosition()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.clips !== this.props.clips) {
      this.buildElementsPosition()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.onWindowFocus)
    window.removeEventListener('blur', this.onWindowBlur)
    window.removeEventListener('keydown', this.onWindowKeyDown)
    window.removeEventListener('click', this.onWindowOnClick)
  }

  onWindowBlur = () => {
    this.setState({
      clipFocusIndex: 0,
      searchTerm: '',
      showFavorites: false,
    })
  }

  onWindowOnClick = event => {
    event.stopPropagation()
  }

  onWindowFocus = () => {
    this.searchInput.focus()
  }

  onWindowKeyDown = event => {
    const clips = this.getClipsSorted()

    // Escape key
    if (event.keyCode === 27) {
      ipcRenderer.send('onHideClipboardView')
    }

    // Arrow down
    if (event.keyCode === 40) {
      event.preventDefault()

      this.setState(({ clipFocusIndex }) => ({
        clipFocusIndex: clips.length === (clipFocusIndex + 1) ? clipFocusIndex : clipFocusIndex + 1
      }), this.scrollToFocusElement)
    }

    // Arrow up
    if (event.keyCode === 38) {
      event.preventDefault()

      this.setState(({ clipFocusIndex }) => ({
        clipFocusIndex: clipFocusIndex !== 0 ? clipFocusIndex - 1 : clipFocusIndex
      }), this.scrollToFocusElement)
    }

    // Enter
    if (event.keyCode === 13) {
      this.onClickClip(clips[this.state.clipFocusIndex])()
    }
  }

  onClickClip = clip => () => {
    clipboard.writeText(clip.payload.text)

    ipcRenderer.send('onHideClipboardView')
  }

  onFocusClip = index => () => {
    this.setState({ clipFocusIndex: index })
  }

  onChangeSearchTerm = term => {
    this.setState({ searchTerm: term })
  }

  onClickFavorite = () => {
    this.setState(({ showFavorites }) => ({
      showFavorites: !showFavorites,
      clipFocusIndex: 0,
    }))
  }

  getClipsSorted = () => {
    const { clips } = this.props
    const { showFavorites, searchTerm } = this.state

    return clips
      .filter(clip => {
        return showFavorites ? clip.isFavorite : true
      })
      .filter(clip => {
        return !!searchTerm.length ? clip.payload.text.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1 : true
      })
      .sort((clip1, clip2) => {
        return compareDesc(new Date(clip1.updatedAt), new Date(clip2.updatedAt))
      })
      .slice(0, 30)
  }

  onClickSetFavorite = clip => () => {
    this.props.setClipFavorite(clip.id, !clip.isFavorite)
  }

  scrollToFocusElement = () => {
    const resultContainer = ReactDOM.findDOMNode(this.resultContainer)
    const currentBottomLine = resultContainer.scrollTop + resultContainer.getBoundingClientRect().height

    const elementPosition = this.elementsPosition[this.state.clipFocusIndex]

    if (currentBottomLine < elementPosition.bottom) {
      resultContainer.scrollTop = elementPosition.bottom - resultContainer.getBoundingClientRect().height
    } else if (resultContainer.scrollTop > elementPosition.top) {
      resultContainer.scrollTop = elementPosition.top
    }
  }

  buildElementsPosition = () => {
    const resultContainer = ReactDOM.findDOMNode(this.resultContainer)

    this.elementsPosition = _.reduce(resultContainer.children, (result, child, index) => {
      const elHeight = child.getBoundingClientRect().height

      result[index] = {
        top: result[index - 1] ? result[index - 1].bottom : 0,
        bottom: result[index - 1] ? result[index - 1].bottom + elHeight : elHeight,
      }

      return result
    }, {})
  }

  render() {
    const {
      clipFocusIndex,
      showFavorites,
      searchTerm,
    } = this.state

    const clips = this.getClipsSorted()

    return (
      <Container>
        <Header>
          <TitleBar>
            Anota
          </TitleBar>

          <NavigationBar
            innerRef={(ref) => this.searchInput = ref}
            onSearch={this.onChangeSearchTerm}
            searchTerm={searchTerm}
            onClickFavorite={this.onClickFavorite}
            isFilterFavorite={showFavorites}
          />
        </Header>

        <Content ref={(ref) => this.resultContainer = ref}>
          {!clips.length && (
            <NoResults>
              No results found.
              <small>
                (cmd+c) to add items.
              </small>
            </NoResults>
          )}

          {!!clips.length && _.map(clips, (clip, index) => (
            <ClipItem
              key={clip.id}
              payload={clip.payload}
              applicationName={clip.application.name}
              applicationTitle={clip.application.title}
              createdAt={clip.createdAt}
              onSelect={this.onClickClip(clip)}
              isFocused={index === clipFocusIndex}
              onFocus={this.onFocusClip(index)}
              isFavorite={clip.isFavorite}
              onClickSetFavorite={this.onClickSetFavorite(clip)}
            />
          ))}
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  clips: _.map(state.CLIPBOARD.collection)
})

const mapActionsToProps = dispatch => ({
  setClipFavorite: (clipId, isFavorite) => dispatch(clipboardActions.setFavorite(clipId, isFavorite)),
})

export default connect(mapStateToProps, mapActionsToProps)(Dashboard)
