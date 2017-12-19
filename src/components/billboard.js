import React from 'react'
import Video from './video'

// to fix font size issue for red button font in chrome browser

const billboardButton = {
  fontSize: '99%'
}

// TODO: make start a petition a <Link>

const BillBoard = () => (
  <div className='container'>
    <div className='row'>
      <div className='span12 billboard-background bump-bottom-1 clearfix'>
        <div className='billboard-video text-center center clearfix'>
          <Video />
          <div className='billboard-text'>
            <h1 className='white big-title'>People Powered Petitions</h1>
            <p className='white size-medium-large'>There are more than 8 million MoveOn members. Tap into our shared people power and create progressive change.</p>
            <a href='/create_start.html?source=petitionshomepage' className='button button-xl background-moveon-bright-red' style={billboardButton}>
              Start a Petition Campaign
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default BillBoard
