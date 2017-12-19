import React from 'react'
import PropTypes from 'prop-types'

import { text2paraJsx } from '../lib.js'
import { thanksLoader } from '../loaders/petition.js'
import SignatureAddForm from './signature-add-form.js'
import SignatureCount from './signature-count.js'
import SignatureList from './signature-list.js'
import PetitionFlagForm from './petition-flag-form.js'

class Petition extends React.Component {
  componentDidMount() {
    // lazy-load thanks page component
    thanksLoader()
  }

  render() {
    const { petition: p, query } = this.props
    const statement = text2paraJsx(p.summary)
    const creator = ((p._embedded && p._embedded.creator) || { name: p.contact_name })
    const petitionBy = creator.name + (creator.organization
                                       ? `, ${creator.organization}`
                                       : '')
    const outOfDate = (p.tags && p.tags.filter(t => t.name === 'possibly_out_of_date').length)
    return (
      <div className='container sign'>
        {(outOfDate) ?
          <div className='message-header'>
            <span className='bell'>This petition has not been edited in a while. As a new legislative session has begun, it&#39;s possible some of the targets of this petition are out of date.</span>
          </div>
          : ''}

        {(p.status !== 'Verified') ?
          <div className='message-header'>
            <PetitionFlagForm petition={p} />
          </div>
          : ''}

        {(p.status === 'Bad') ?
          <div className='message-header'>
            <span className='bell'>MoveOn volunteers reviewed this petition and determined that it either may not reflect MoveOn members&#39; progressive values, or that MoveOn members may disagree about whether to support this petition. MoveOn will not promote the petition beyond hosting it on our site. <a href='https://act.moveon.org/cms/thanks/thanks-your-input' target='_blank'>Click here</a> if you think MoveOn should support this petition.
            </span>
          </div>
          : ''}

        {(p.tags && p.tags.filter(t => t.name === 'outcome:victory').length) ?
          <div className='message-header'>
            <img alt='star icon' src='/images/star.png' height='30' width='30' />
            <span><strong>Victory!</strong> The creator of this petition declared the campaign a success. You can still sign the petition to show support.</span>
          </div>
          : ''}

        {(query.fwd) ?
          <div className='message-header'>
            <span className='bell'>  We&#39;ve forwarded you to this trending petition.  To return to your previous action, use your browser&#39;s back button.
            </span>
          </div>
          : ''}

        <div className='row'>
          <SignatureAddForm petition={p} query={this.props.query} />

          <div className='span8 pull-right petition-info-top'>
            <div className='percent-95 padding-left-15 form-wrapper responsive padding-bottom-1 padding-left-2 padding-right-3' style={{ marginLeft: '-20px', position: 'relative' }}>
              <div className='petition-top hidden-phone'>
                <h1 id='petition-title' className='moveon-bright-red big-title'>{p.title}</h1>
                <p id='by' className='byline lh-20'>
                  Petition by <a href={`/contact_creator.html?petition_id=${p.petition_id}`} className='underline'>
                      {petitionBy}
                  </a>
                </p>
                <p id='to-target' className='lh-14 bump-top-1 bump-bottom-1 margin-0 disclaimer'>To be delivered to <span className='all-targets'><strong>
                    {p.target.map((t) => t.name).join(', ')}</strong></span></p>
              </div>
              <div id='pet-statement-box' className='lh-36 blockquote'>
                <h3 className='visible-phone moveon-bright-red'>Petition Statement</h3>
                <div id='pet-statement'>{statement}</div>
              </div>

              <SignatureCount current={p.total_signatures} goal={p.signature_goal} />
            </div>

            <div className='clear'></div>

            <div id='pet-explain' className='background-moveon-white bump-top-1 padding-left-2' style={{ marginLeft: '-20px' }}>
              <div className='widget'>
                <div className='widget-top'>
                  <h3 className='moveon-bright-red padding-bottom-1'>Petition Background</h3>
                </div>
                {p.featured_image_url ? (
                  <img id='pet-image' src={p.featured_image_url} role='presentation' />
                ) : ''}
                <div dangerouslySetInnerHTML={{ __html: p.description }}></div>
              </div>

              <div className='widget hidden-phone'>
                <div className='widget-top'>
                  <h3 className='moveon-bright-red padding-bottom-1'>Current petition signers</h3>
                </div>

                <SignatureList
                  petitionSlug={p.slug}
                  signatureCount={p.total_signatures}
                />

                <div>
                  <div id='pet-signers' className='bump-top-1'>
                  </div>
                  <form id='flag-comment-form' action='/flag_comment.html' method='POST'>
                    <input id='flag-comment-user-id' type='hidden' name='user_id' value='' />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Petition.propTypes = {
  petition: PropTypes.object.isRequired,
  query: PropTypes.object
}

export default Petition
