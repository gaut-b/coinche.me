import React from 'react';
import Header from '../components/Header';
import LastTrick from './LastTrick';

const Layout = ({mode, children, toggleLastTrick}) => {
  const containerMode = mode === 'container';
  const wrappedChildren = containerMode ? (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-10 is-8-desktop is-7-widescreen is-6-fullhd">
          {children}
        </div>
      </div>
    </div>
  ) : (children);

  return (
    <div>
      <Header toggleLastTrick={toggleLastTrick}/>
      <LastTrick toggleLastTrick={toggleLastTrick} />
      <div className={`section is-main ${containerMode ? '' : 'is-full-screen'}`}>
        {wrappedChildren}
      </div>
    </div>
  );
};

export default Layout;