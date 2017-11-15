import React from 'react'
import { Router, Route, browserHistory, hashHistory } from 'react-router'

import { Config } from '../config'
import { loadSession } from '../actions/sessionActions'
import SignPetition from '../pages/sign-petition'
import ThanksPage from '../pages/thanks'
import Nav from '../components/nav'

const baseAppPath = process.env.BASE_APP_PATH || '/'

export const appLocation = (Config.USE_HASH_BROWSING ? hashHistory : browserHistory)

export const routes = (store) => (
  <Router history={appLocation}>
    <Route path="*" component={Nav} onEnter={(nextState) => { store.dispatch(loadSession(nextState)) }} />
  </Router>
)