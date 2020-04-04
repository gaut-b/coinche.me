import React, { useState } from 'react';
import { connect } from 'react-redux';
import { selectLastTrick } from '../redux/selectors';

import Card from './Card';

import '../../scss/components/lastTrick.scss';

const LasTrick = ({isVisible, toggleLastTrick,  lastTrick}) => {

    console.log(isVisible)

    return (
        <div className={`overlay ${isVisible ? 'isVisible' : ''}`} onClick={toggleLastTrick} >
            <div className="overlay-content hand is-normal">
                { (lastTrick) ?
                    lastTrick.cards.map( c => <Card key={c} value={c} /> ) :
                    "Aucun plis n'a été joué pour le moment"
                }
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    lastTrick: selectLastTrick(state),
});

export default connect(mapStateToProps)(LasTrick);