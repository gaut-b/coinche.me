import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import '../../scss/components/header.scss';
import { undo, distribute } from '../redux/actions/socketActions';
import { toggleIsLastTrickVisible } from '../redux/actions/localActions';
import {isArray, isFunction} from '../../../shared/utils/boolean';
import {selectCurrentPlayer, selectNbPlayers, selectTableId} from '../redux/selectors/game'

const Header = ({currentPlayer, nbPlayers, distribute, undo, toggleIsLastTrickVisible, tableId}) => {
  const [menuShown, showMenu] = useState(false);

  const toggleMenu = e => showMenu(!menuShown);

  const menu = [{
    label: 'Comment ça marche ?',
    to: '/help'
  }, {
    label: 'Paramètres',
    to: '/config'
  }].concat(tableId ? [{
    label: 'Partie en cours',
    to: `/game/${tableId}`,
    dropdown: [{
      label: 'Annuler l\'action précédente',
      onClick: e => undo(),
    }, {
      label: 'Redistribuer',
      onClick: e => {
        if (window.confirm('Voulez-vous vraiment redistribuer une nouvelle partie et annuler celle en cours ?')) {
          distribute(currentPlayer.id)
        }
      },
    }, {
      label: 'Revoir le dernier pli',
      onClick: e => {
        toggleMenu();
        toggleIsLastTrickVisible();
      },
    }]
  }] : [])

  const renderMenuEntry = (entry, i) => {
    if (isArray(entry.dropdown)) {
      return (
        <div key={entry.label} className="navbar-item has-dropdown is-active">
          <Link to={entry.to} className="navbar-link is-arrowless">
            {entry.label}
          </Link>
          <div className="navbar-dropdown">
            {entry.dropdown.map(renderMenuEntry)}
          </div>
        </div>
      );
    }
    if (entry.divider)
      return <hr key={`divider-${i}`} className="navbar-divider" />;
    if (entry.to)
      return <Link key={entry.label} className="navbar-item" to={entry.to}>{entry.label}</Link>;
    if (isFunction(entry.onClick))
      return <a key={entry.label} className="navbar-item" onClick={e => (entry.onClick() && toggleMenu())}>{entry.label}</a>;
  }

  return (
    <nav className="navbar is-fixed-top is-spaced" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <h1>Coinche.me</h1>
        </Link>

        <a onClick={toggleMenu} role="button" className={`navbar-burger burger ${menuShown ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div className={`navbar-menu ${menuShown ? 'is-active' : ''}`}>
        <div className="navbar-end">
          {menu.map(renderMenuEntry)}
        </div>
      </div>
    </nav>
  )
}

const mapStateToProps = createStructuredSelector({
  tableId: selectTableId,
  currentPlayer: selectCurrentPlayer,
  nbPlayers: selectNbPlayers,
});

const mapDispatchToProps = {
  distribute,
  undo,
  toggleIsLastTrickVisible,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);