import React, { useState } from 'react';
import { connect } from 'react-redux';
import { selectLastTrick } from '../redux/selectors';

import '../../scss/components/lastTrick.scss';

const LasTrick = ({isVisible, lastTrick}) => {

    return (
        <div className={'overlay ${(isVisible) isVisible : null'}>
            <div className={`hand is-${style} ${isHidden ? 'is-hidden-face' : ''}`}>
                {lastTrick.map(({cards}) => {
                    return cards.map( c => <Card key={c} value={c} /> )
                })}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    lastTrick: selectLastTrick(state),
});

export default connect(mapStateToProps)(LasTrick);