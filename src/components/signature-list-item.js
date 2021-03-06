import React from 'react'
import PropTypes from 'prop-types'

import { formatDate } from '../lib.js'

const SignatureListItem = ({ user, createdDate, number }) => {
  const { city, state, name } = user
  const location = ((!city) ? state : `${city}, ${state}`)
  const fromLocation = ((location === '') ? '' : `from ${location}`)
  const date = new Date(createdDate)
  return (
    <li className='signer'>
      <span className='signer-number'>{number}</span>{' '}
      <b>{name}</b> {fromLocation} signed this petition on {formatDate(date)}.
    </li>
  )
}

SignatureListItem.propTypes = {
  user: PropTypes.shape({
    city: PropTypes.string,
    state: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }),
  createdDate: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired
}

export default SignatureListItem
