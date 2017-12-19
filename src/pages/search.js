import React from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { searchLoader } from '../loaders/petition.js'


class SearchPage extends React.Component {
  componentWillMount() {
    const self = this
    searchLoader().then((deps) => {
      self.Search = deps.Search.default
      self.forceUpdate()
    })

    const { dispatch } = this.props
  }

  render() {
    return (
      <div>
        {(this.Search ?
          <this.Search user={this.props.user} /> :
          ''
        )}
      </div>
    )
  }

}

SearchPage.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func
}

function mapStateToProps(store, ownProps) {
  return {
    user: store.userStore
  }
}

export default connect(mapStateToProps)(SearchPage)
