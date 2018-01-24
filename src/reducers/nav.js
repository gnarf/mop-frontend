import { combineReducers } from 'redux'
import { actionTypes as navActionTypes } from '../actions/navActions.js'
import { actionTypes as petitionActionTypes } from '../actions/petitionActions.js'

const { FETCH_PETITION_SUCCESS, FETCH_TOP_PETITIONS_SUCCESS } = petitionActionTypes
const { FETCH_ORG_SUCCESS } = navActionTypes

/* nav state:
 * {
 *   partnerCobrand: null || { logo_image_url, organization, browser_url },
 *   orgs: { [slug]: org }
 * }
 */

const getCobrandFromPetition = (petition = {}) => {
  // grab the sponsor / creator properties from _embedded if it exists
  const { _embedded: { sponsor, creator } = {} } = petition
  const branding = sponsor || creator
  if (!branding) {
    return null
  }

  const { logo_image_url, organization, browser_url } = branding
  // eslint-disable-next-line camelcase
  if (!logo_image_url) {
    return null
  }

  return { logo_image_url, organization, browser_url }
}

function partnerCobrand(state = null, action) {
  switch (action.type) {
    case FETCH_PETITION_SUCCESS:
      return getCobrandFromPetition(action.petition)
    case FETCH_TOP_PETITIONS_SUCCESS:
      return getCobrandFromPetition(action.petitions[0])
    default:
      return state
  }
}

function orgs(state = {}, action) {
  switch (action.type) {
    case FETCH_ORG_SUCCESS:
      return {
        ...state,
        [action.slug]: action.org
      }
    default:
      return state
  }
}

export default combineReducers({
  partnerCobrand,
  orgs
})

