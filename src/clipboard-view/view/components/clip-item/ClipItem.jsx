import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import { FavoriteButton } from './../'

import {
  Container,
  Paper,
  Content,
  Footer,
  Header,
  Title,
} from './styles'

class ClipItem extends PureComponent {
  render() {
    const {
      createdAt,
      isFavorite,
      isFocused,
      onFocus,
      onSelect,
      onClickSetFavorite,
      applicationName,
      applicationTitle,
      payload: {
        text,
      }
    } = this.props

    return (
      <Container
        onClick={onFocus}
        onDoubleClick={onSelect}
        isFocused={isFocused}
      >
        <Paper zDepth={isFocused ? 2 : 1}>
          <Header>
           <Title isFocused={isFocused}>
             {[applicationName, applicationTitle].join(' | ')}
           </Title>

           {(isFocused || isFavorite) && (
             <FavoriteButton
               style={{flexShrink: 0}}
               value={isFavorite}
               onClick={onClickSetFavorite}
             />
           )}
         </Header>

         <Content dangerouslySetInnerHTML={{ __html: text }} />

          <Footer>
            <div>
              Created at {format(new Date(createdAt), 'HH:mm')}
            </div>

            {isFocused && (
              <div>
                Enter to copy
              </div>
            )}
          </Footer>
        </Paper>
      </Container>
    )
  }
}

ClipItem.defaultProps = {
  payload: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  isFocused: PropTypes.bool,
  createdAt: PropTypes.string,
  onFocus: PropTypes.func,
  isFavorite: PropTypes.bool,
  onClickSetFavorite: PropTypes.func,
  applicationName: PropTypes.string,
  applicationTitle: PropTypes.string,
}

export default ClipItem
// <Header>
//           <Title isFocused={isFocused}>
//             {[applicationName, applicationTitle].join(' | ')}
//           </Title>

//           {(isFocused || isFavorite) && (
//             <FavoriteButton
//               style={{flexShrink: 0}}
//               value={isFavorite}
//               onClick={onClickSetFavorite}
//             />
//           )}
//         </Header>
        // <Footer>
        //   <div>
        //     Created at {format(new Date(createdAt), 'HH:mm')}
        //   </div>

        //   {isFocused && (
        //     <div>
        //       Enter to copy
        //     </div>
        //   )}
        // </Footer>
