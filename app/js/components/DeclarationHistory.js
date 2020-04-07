import React from 'react';
import { connect } from 'react-redux';
import gameTypes from '../../../shared/constants/gameTypes';
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
              switch (content.gameType) {
                case gameTypes.STANDARD:
                  return (
                    <li key={index}>
                      { `${players.find(p => p.id === playerId).name || 'BOT'} a annoncé ${content.objectif}  `}
                      <span className="icon is-small">
                        <img src={symbols[content.selectedColor]}/>
                      </span>
                    </li>
                  );
                case gameTypes.NO_TRUMP:
                  return (
                    <li key={index}>
                      {`${players.find(p => p.id === playerId).name || 'BOT'} a annoncé ${content.objectif} sans atouts`}
                    </li>
                  );
                case gameTypes.ALL_TRUMP:
                  return (
                    <li key={index}>
                      {`${players.find(p => p.id === playerId).name || 'BOT'} a annoncé ${content.objectif} tout atout`}
                    </li>
                  );
                case gameTypes.CAPOT:
                  return (
                    <li key={index}>
                      {`${players.find(p => p.id === playerId).name || 'BOT'} a annoncé capot  `}
                      <span className="icon is-small">
                        <img src={symbols[content.selectedColor]}/>
                      </span>
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