import React from 'react';
import { connect } from 'react-redux';
import trumpTypes from '../../../shared/constants/trumpTypes';
import { selectPlayers, selectCurrentPlayer, selectDeclarationsHistory } from '../redux/selectors';

const HeartSymbol = require('../../images/heart.svg');
const SpadesSymbol = require('../../images/spades.svg');
const DiamondSymbol = require('../../images/diamonds.svg');
const ClubSymbol = require('../../images/clubs.svg');

const symbols = {
  'H': HeartSymbol,
  'S': SpadesSymbol,
  'D': DiamondSymbol,
  'C': ClubSymbol,
};

const DeclarationHistory = ({declarations, players, playerId}) => {

  return (
      (declarations) ?
        <ul>
          {
            declarations.map(({playerId, content}, index) => {
              switch (content.trumpType) {
                case trumpTypes.S:
                case trumpTypes.H:
                case trumpTypes.D: 
                case trumpTypes.C:
                  return (
                    <li key={index}>
                      {`${players.find(p => p.id === playerId).name || 'BOT'} a annoncé ${(content.goal !== 250) ? content.goal : 'capot'}  `}
                      <span className="icon is-small">
                        <img src={symbols[content.trumpType]}/>
                      </span>
                    </li>
                  );
                case trumpTypes.NO_TRUMP:
                  return (
                    <li key={index}>
                      {`${players.find(p => p.id === playerId).name || 'BOT'} a annoncé ${content.goal} sans atouts`}
                    </li>
                  );
                case trumpTypes.ALL_TRUMP:
                  return (
                    <li key={index}>
                      {`${players.find(p => p.id === playerId).name || 'BOT'} a annoncé ${content.goal} tout atout`}
                    </li>
                  );
                default:
                  return (
                    <li key={index}>
                      {`${players.find(p => p.id === playerId).name || 'BOT'} a passé`}
                    </li>
                  );
                }
            })
          }
        </ul> :
        null
  );
};

const mapStateToProps = (state) => ({
  players: selectPlayers(state),
  currentPlayer: selectCurrentPlayer(state),
  declarations: selectDeclarationsHistory(state),
});

export default connect(mapStateToProps)(DeclarationHistory);