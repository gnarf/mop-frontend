import React from 'react';
import { expect } from 'chai';

import outkastPetition from '../../local/api/v1/petitions/outkast.json'
import outkastPetition2 from '../../local/api/v1/petitions/outkast-opposite.json'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { createMockStore } from 'redux-test-utils';

import { shallow, mount } from 'enzyme';
import { shallowWithStore } from 'enzyme-redux';
import { unwrapReduxComponent } from '../lib';

import SignatureAddForm from '../../src/components/signature-add-form';

describe('<SignatureAddForm />', () => {
  // This file is organized into two sub- describe() buckets.
  // 1. for "static tests" which do not involve any state
  // 2. for changing state (like filling in forms, etc)
  // Please put new tests in the appropriate bucket with `it(...)`
  // Below are a set of profiles and user store states that can be re-used
  // for different test conditions

  const propsProfileBase = { petition: outkastPetition, query: {} }
  const propsProfileOpposite = { petition: outkastPetition2, query: {} }
  const outkastPetition2AsMegapartner = JSON.parse(JSON.stringify(outkastPetition2)) //deepcopy
  outkastPetition2AsMegapartner._embedded.creator.source = 'M.O.P.' //set as megapartner
  const petitionProfiles = {
    'megapartner_mayoptin': outkastPetition2AsMegapartner,
    'mayoptin': outkastPetition2,
    'normal': outkastPetition
  }

  const storeAnonymous = { userStore: { anonymous: true }}
  const storeAkid = { userStore: { signonId: 123456,
                                   token: 'akid:fake.123456.bad123',
                                   given_name: 'Three Stacks'}}
  const storeAkidHasAddress = { userStore: { signonId: 123456,
                                             token: 'akid:fake.123456.bad123',
                                             given_name: 'Three Stacks',
                                             postal_addresses: [{status: 'Potential'}]}}

  describe('<SignatureAddForm /> static tests', () => {
    //THESE ARE TESTS WHERE NO STATE IS CHANGED -- we send in properties, and the rest should be static

    it('basic loading', () => {
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store}/>)
      const component = unwrapReduxComponent(context)
      expect(component.props.user.anonymous).to.be.equal(true)
      expect(context.find('#sign-here').text().match(/Sign this petition/)[0]).to.equal('Sign this petition');
    });

    it('anonymous fields displaying', () => {
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store}/>)
      const component = unwrapReduxComponent(context)
      expect(component.props.user.anonymous).to.be.equal(true)
      expect(context.find('input[name="name"]').length).to.equal(1);
      expect(context.find('input[name="email"]').length).to.equal(1);
      expect(context.find('input[name="address1"]').length).to.equal(1);
      expect(context.find('input[name="address2"]').length).to.equal(1);
      expect(context.find('input[name="city"]').length).to.equal(1);
      // not testing state because state is a sub component
      // expect(context.find('input[name="state"]').length).to.equal(1);
      expect(context.find('input[name="zip"]').length).to.equal(1);
    });

    it('petition with user fields displaying', () => {
      // Note: needs to test when it *appears* not when it's required
      const store = createMockStore(storeAkid)
      const context = mount(<SignatureAddForm {...propsProfileOpposite} store={store}/>)
      const component = unwrapReduxComponent(context)
      expect(Boolean(component.props.user.anonymous)).to.be.equal(false)
      expect(context.find('input[name="name"]').length).to.equal(0);
      expect(context.find('input[name="email"]').length).to.equal(0);
      expect(context.find('input[name="address1"]').length).to.equal(1);
      expect(context.find('input[name="address2"]').length).to.equal(1);
      expect(context.find('input[name="city"]').length).to.equal(1);
      // not testing state because state is a sub component
      // expect(context.find('input[name="state"]').length).to.equal(1);
      expect(context.find('input[name="zip"]').length).to.equal(1);
    });

    it('local petition with user fields displaying', () => {
      const store = createMockStore(storeAkid)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store}/>)
      const component = unwrapReduxComponent(context)
      expect(Boolean(component.props.user.anonymous)).to.be.equal(false)
      expect(context.find('input[name="name"]').length).to.equal(0);
      expect(context.find('input[name="email"]').length).to.equal(0);
      expect(context.find('input[name="address1"]').length).to.equal(1);
      expect(context.find('input[name="address2"]').length).to.equal(1);
      expect(context.find('input[name="city"]').length).to.equal(1);
      // not testing state because state is a sub component
      // expect(context.find('input[name="state"]').length).to.equal(1);
      expect(context.find('input[name="zip"]').length).to.equal(1);
    });

    //it('TODO:local petition without address when user has address', () => {});

    it('show optin warning', () => {
      // should be: megapartner + not recognized user
      const showStore = createMockStore(storeAnonymous)
      const showContext = mount(<SignatureAddForm {...propsProfileOpposite} store={showStore}/>)
      let wasShown = false
      showContext.find('.disclaimer').forEach((node) => {
        if (/project of M.O.P./.test(node.text())) {
          wasShown = true
        }
      })
      expect(wasShown).to.equal(true);

      const nowarningStore = createMockStore(storeAkid)
      const nowarningContext = mount(<SignatureAddForm {...propsProfileOpposite} store={nowarningStore}/>)
      wasShown = false
      nowarningContext.find('.disclaimer').forEach((node) => {
        if (/project of M.O.P./.test(node.text())) {
          wasShown = true
        }
      })
      expect(wasShown).to.equal(false);
    });

    it('optin checkbox or hidden optin: normal profiles', () => {
      const normalProfiles = [
        { petition: 'normal', query: {} },
        { petition: 'normal', query: { source: 'c.123', mailing_id: '123' }},
      ]
      const mockStoreAnon = createMockStore(storeAnonymous)

      normalProfiles.forEach((profile) => {
        const realProfile = { petition: petitionProfiles[profile.petition], query: profile.query }
        const context = mount(<SignatureAddForm {...realProfile} store={mockStoreAnon}/>)
        const component = unwrapReduxComponent(context)
        // 1. make sure NOT shown
        expect(context.find('input[name="thirdparty_optin"]').length,
               'normal profile should not show optin checkbox: ' + JSON.stringify(profile)
              ).to.equal(0);
        // 2. make sure optin options are false
        expect(component.state.hidden_optin,
               'hidden_optin is false for normal profile: ' + JSON.stringify(profile)
              ).to.equal(false);
        expect(component.state.thirdparty_optin,
               'thirdparty_optin is false for normal profile: ' + JSON.stringify(profile)
              ).to.equal(false);
      })
    })
    it('optin checkbox or hidden optin: hide profiles', () => {
      const hideProfiles = [ // should have hidden optin
        { petition: 'megapartner_mayoptin', query: { source: 'c.123' }},
        { petition: 'megapartner_mayoptin', query: { source: 'c.123', mega_partner: '1' }},
        { petition: 'mayoptin', query: { source: 'c.123' }}, // no mailing_id
      ]
      const mockStoreAnon = createMockStore(storeAnonymous)
      hideProfiles.forEach((profile) => {
        const realProfile = { petition: petitionProfiles[profile.petition], query: profile.query }
        const context = mount(<SignatureAddForm {...realProfile} store={mockStoreAnon}/>)
        const component = unwrapReduxComponent(context)
        // 1. make sure NOT shown
        expect(context.find('input[name="thirdparty_optin"][type="checkbox"]').length,
               'hidden optin profile should not have optin checkbox: ' + JSON.stringify(profile)
              ).to.equal(0);
        // 2. make sure hidden is true
        expect(component.state.hidden_optin,
               'hidden optin profile have hidden_optin=true: ' + JSON.stringify(profile)
              ).to.equal(true);
      })
    })
    it('optin checkbox or hidden optin: show profiles', () => {
      const showProfiles = [
        { petition: 'megapartner_mayoptin', query: { source: 'c.123', mailing_id: '123' }},
        { petition: 'megapartner_mayoptin', query: { source: 's.imn', mega_partner: '1' }},
        { petition: 'megapartner_mayoptin', query: {} },
        //non-megapartner, but still may_optin: true
        { petition: 'mayoptin', query: { source: 'c.123', mailing_id: '123' }},
        { petition: 'mayoptin', query: { source: 's.abc' }}
      ]
      const mockStoreAnon = createMockStore(storeAnonymous)
      const mockStoreAkid = createMockStore(storeAkid)
      showProfiles.forEach((profile) => {
        const realProfile = { petition: petitionProfiles[profile.petition], query: profile.query }
        const context = mount(<SignatureAddForm {...realProfile} store={mockStoreAnon}/>)
        const component = unwrapReduxComponent(context)
        // 1. make sure shown
        expect(context.find('input[name="thirdparty_optin"][type="checkbox"]').length,
               'Show optin checkbox for ' + JSON.stringify(profile)
              ).to.equal(1);
        // 2. make sure hidden is false
        expect(component.state.hidden_optin,
               'hidden_optin is false for ' + JSON.stringify(profile)
              ).to.equal(false);
        // 3. make sure with user it's not shown
        const userContext = mount(<SignatureAddForm {...realProfile} store={mockStoreAkid}/>)
        expect(userContext.find('input[name="thirdparty_optin"]').length,
               'optin checkbox with user should NOT show for ' + JSON.stringify(profile)
              ).to.equal(0);
      })
    })

    //it('TODO:non-US address', () => {});

  })
  describe('<SignatureAddForm /> stateful tests', () => {
    //THESE ARE TESTS WHERE WE CHANGE THE STATE (FILL IN FORM, ETC)
    // it('TODO:non-US address', () => {})
    // it('TODO:logout/unrecognize shows anonymous field list', () => {})

    it('checking volunteer requires phone', () => {
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store}/>)
      const component = unwrapReduxComponent(context)
      const reqFieldsBefore = component.updateRequiredFields(true)
      expect(typeof reqFieldsBefore.phone).to.be.equal('undefined')
      component.volunteer({target:{checked: true}})
      expect(component.state.volunteer).to.be.equal(true)
      const reqFieldsAfter = component.updateRequiredFields(true)
      expect(typeof reqFieldsAfter.phone).to.be.equal('string')

      component.setState({address1:'123 main', city:'Pittsburgh', state:'PA', name:'John Smith', email:'hi@example.com', zip:'60024'})
      expect(component.formIsValid()).to.be.equal(false)
      component.setState({phone: '123-123-1234'})
      expect(component.formIsValid()).to.be.equal(true)
    })

    // it('TODO:typing incomplete fields submit fails and displays validation error messages', () => {})

    it('submitting petition gives good data', () => {
      // MORE TODO HERE
      const store = createMockStore(storeAnonymous)
      const context = mount(<SignatureAddForm {...propsProfileBase} store={store}/>)
      const component = unwrapReduxComponent(context)

      component.volunteer({target:{checked: true}})
      expect(component.state.volunteer).to.be.equal(true)
    })
  })
});
