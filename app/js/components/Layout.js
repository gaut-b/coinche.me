import React, { useState } from 'react';
import Header from '../components/Header';

const Layout = ({children}) => {
  return (
    <div>
      <Header />
      <div className="section is-full-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;