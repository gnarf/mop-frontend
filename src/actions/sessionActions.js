import 'whatwg-fetch'

import Config from '../config.js'

export const actionTypes = {
  ANONYMOUS_SESSION_START: 'ANONYMOUS_SESSION_START',
  UNRECOGNIZE_USER_SESSION: 'UNRECOGNIZE_USER_SESSION',
  USER_SESSION_START: 'USER_SESSION_START',
  USER_SESSION_FAILURE: 'USER_SESSION_FAILURE',
  TOKEN_SESSION_START: 'TOKEN_SESSION_START',
  TOKEN_SESSION_FAILURE: 'TOKEN_SESSION_FAILURE'
}

export function unRecognize() {
  return (dispatch) => {
    dispatch({
      type: actionTypes.UNRECOGNIZE_USER_SESSION
    })
  }
}

export function loadUserSession() {
  return (dispatch) => {
    fetch(`${Config.API_URI}/api/v1/user/session.json`, {
      credentials: 'include'
    })
    .then(
      (response) => response.json().then((json) => {
        dispatch({
          type: actionTypes.USER_SESSION_START,
          session: json
        })
      }),
      (err) => {
        dispatch({
          type: actionTypes.USER_SESSION_FAILURE,
          error: err
        })
      }
    )
  }
}

export function loadTokenSession(tokens) {
  return (dispatch) => {
    const args = Object.keys(tokens)
      .map((k) => ((tokens[k]) ? `${encodeURIComponent(k)}=${encodeURIComponent(tokens[k])}` : ''))
      .join('&')
    const queryString = (args && args !== '&') ? `?${args}` : ''
    fetch(`${Config.API_URI}/api/v1/user/session.json${queryString}`)
    .then(
      (response) => response.json().then((json) => {
        dispatch({
          type: actionTypes.TOKEN_SESSION_START,
          session: json,
          tokens
        })
      }),
      (err) => {
        dispatch({
          type: actionTypes.TOKEN_SESSION_FAILURE,
          error: err,
          tokens
        })
      }
    )
  }
}

export const loadSession = ({ location }) => {
  // called straigt from top route onEnter, so it's done only once on first-load
  const cookie = String(document.cookie).match(new RegExp(`${Config.SESSION_COOKIE_NAME}=([^;]+)`))

  if (cookie) {
    return loadUserSession()
  } else if (location && location.query
             && (location.query.akid || location.query.id)) {
    const tokens = {}
    if (location.query.akid) {
      tokens.akid = location.query.akid
    }
    if (location.query.id) {
      tokens.hashedId = location.query.id
    }
    return loadTokenSession(tokens)
  }
  return (dispatch) => {
    dispatch({
      type: actionTypes.ANONYMOUS_SESSION_START
    })
  }
}


export const actions = {
  unRecognize,
  loadTokenSession,
  loadUserSession,
  loadSession
}
