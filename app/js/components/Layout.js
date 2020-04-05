import React, { useState } from 'react';
import Header from '../components/Header';
import LastTrick from './LastTrick';

const Layout = ({mode, children, toggleLastTrick}) => {
  const wrappedChildren = mode === 'container' ? (
    <div className="container">
      <div className="columns">
        <div className="column is-6 is-offset-3 is-4-widescreen is-offset-4-widescreen">
          {children}
        </div>
      </div>
    </div>
  ) : (children);

  return (
    <div>
      <Header toggleLastTrick={toggleLastTrick}/>
      <LastTrick toggleLastTrick={toggleLastTrick} />
      <div className="section is-full-screen">
        {wrappedChildren}
      </div>
    </div>
  );
};

export default Layout;