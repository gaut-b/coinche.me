import React, { useState } from 'react';
import Header from '../components/Header';

const Layout = ({mode, children}) => {
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
      <Header />
      <div className="section is-full-screen">
        {wrappedChildren}
      </div>
    </div>
  );
};

export default Layout;