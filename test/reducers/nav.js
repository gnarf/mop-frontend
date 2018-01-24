import { expect } from 'chai'
import reducer from '../../src/reducers'
import { navOrg, cobrand, orgCobrand } from '../../src/selectors/nav'

import { actionTypes as navActionTypes } from '../../src/actions/navActions.js'
import { actionTypes as petitionActionTypes } from '../../src/actions/petitionActions.js'

const { FETCH_PETITION_SUCCESS, FETCH_TOP_PETITIONS_SUCCESS } = petitionActionTypes
const { FETCH_ORG_SUCCESS } = navActionTypes

const defaultState = reducer(undefined, {})

describe('nav reducer', () => {
  it('default state', () => {
    // not using a selector, no selector should ever point here anyway
    expect(defaultState.nav).to.deep.equal({
      orgs: {},
      partnerCobrand: null
    })
    expect(orgCobrand(defaultState, 'test'), 'orgCobrand test').to.equal(undefined)
    expect(orgCobrand(defaultState), 'orgCobrand no slug').to.equal(undefined)
  })

  it('orgCobrand selector', () => {
    const org = { test: true }
    const sponsor = { logo_image_url: 'yes.jpg', organization: 'Move On', browser_url: 'http://' }

    let state = reducer(undefined, { type: FETCH_ORG_SUCCESS, slug: 'test', org })
    state = reducer(state, { type: FETCH_PETITION_SUCCESS, petition: { _embedded: { sponsor } } })

    expect(orgCobrand(state))
      .to.deep.equal(sponsor)

    expect(orgCobrand(state, 'test'))
      .to.deep.equal(org)

    expect(orgCobrand(state, 'notthere'))
      .to.equal(undefined)
  })

  it('adds orgs to table when FETCH_ORG_SUCCESS', () => {
    const type = FETCH_ORG_SUCCESS
    const action = {
      type,
      slug: 'test',
      org: { test: true }
    }

    let state = reducer(defaultState, action)
    expect(navOrg(state, action.slug), 'navOrg test')
      .to.equal(action.org)

    state = reducer(state, { type, slug: 'test2', org: 'test2' })
    expect(navOrg(state, 'test2'), 'navOrg test2 saved')
      .to.equal('test2')
    expect(navOrg(state, 'test'), 'navOrg test unchanged')
      .to.equal(action.org)

    state = reducer(state, { type, slug: 'test', org: 'test' })
    expect(navOrg(state, 'test'), 'orgs.test overwritten')
      .to.equal('test')
    expect(navOrg(state, 'test2'), 'orgs.test2 unchanged')
      .to.equal('test2')
  })

  const brandOnly = { logo_image_url: 'yes.jpg', organization: 'Move On', browser_url: 'http://' }
  const brandWithFluff = { ...brandOnly, fluff: true }
  const wrongBrand = { ...brandWithFluff, organization: 'not me' }

  function testPetitionVariants(name, actionCreator) {
    describe(name, () => {
      it('sets cobrand using sponsor', () => {
        const state = reducer(defaultState, actionCreator({ _embedded: { sponsor: brandWithFluff } }))
        expect(cobrand(state)).to.deep.equal(brandOnly)
      })

      it('sets cobrand using creator', () => {
        const state = reducer(defaultState, actionCreator({ _embedded: { creator: brandWithFluff } }))
        expect(cobrand(state)).to.deep.equal(brandOnly)
      })

      it('sets cobrand using sponsor when both sponsor and creator', () => {
        const state = reducer(defaultState, actionCreator({ _embedded: { sponsor: brandWithFluff, creator: wrongBrand } }))
        expect(cobrand(state)).to.deep.equal(brandOnly)
      })

      it('sets to null after a new action without sponsor or creator', () => {
        const filledState = reducer(defaultState, actionCreator({ _embedded: { creator: brandWithFluff } }))

        const state = reducer(filledState, actionCreator({}))
        expect(cobrand(state)).to.deep.equal(null)
      })
    })
  }

  testPetitionVariants('FETCH_PETITION_SUCCESS', petition => ({
    type: FETCH_PETITION_SUCCESS,
    petition
  }))

  testPetitionVariants('FETCH_TOP_PETITIONS_SUCCESS', petition => ({
    type: FETCH_TOP_PETITIONS_SUCCESS,
    petitions: [petition]
  }))
})
