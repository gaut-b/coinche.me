import React, { Component } from 'react';

import Card from './Card.js'
import Hand from './Hand.js';

const Layout = () => (
  <div className="container">
    <div className="has-text-centered">
      <h1 className="title is-1">Le coincheur</h1>
      <p className="subtitle">Jouez en ligne avec vos amis</p>
    </div>
    <div className="section cardinal-points">
      <div className="level">
        <div className="north">
          <Hand cards={['2C', '2H']} isHidden={true} isCompact={true} />
        </div>
      </div>
      <div className="level">
        <div className="level-left">
          <div className="west">
            <Hand cards={['2C', '2H']} isHidden={true} isCompact={true} />
          </div>
        </div>
        <div className="level-right">
          <div className="east">
            <Hand cards={['2C', '2H']} isHidden={true} isCompact={true} />
          </div>
        </div>
      </div>
      <div className="level">
        <div className="south">
          <Hand cards={['2C', '2H']} isHidden={false} isCompact={true} />
        </div>
      </div>
    </div>
  </div>
)

export default Layout;