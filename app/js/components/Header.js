import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TableIdContext } from '../pages/GamePage.js';
import '../../scss/components/header.scss';
import { undo, distribute } from '../redux/actions';
import {isArray, isFunction} from '../../../shared/utils/boolean';
import {selectCurrentPlayer} from '../redux/selectors'

const Header = ({currentPlayer, distribute, undo}) => {
  const [menuShown, showMenu] = useState(false);
  const tableId = useContext(TableIdContext);

  const toggleMenu = e => showMenu(!menuShown);

  const menu = [{
    label: 'Paramètres',
    to: '/config'
  }].concat(tableId ? [{
    label: 'Partie en cours',
    dropdown: [{
      label: 'Annuler l\'action précédente',
      onClick: e => undo(tableId),
    }, {
      label: 'Redistribuer',
      onClick: e => {
        if (window.confirm('Voulez-vous vraiment redistribuer une nouvelle partie et annuler celle en cours ?')) {
          distribute(tableId, currentPlayer.id)
        }
      },
    }, {
      label: 'Revoir le dernier pli',
      onClick: e => console.log('Not yet implemented'),
    }]
  }] : [])

  const renderMenuEntry = (entry, i) => {
    if (entry.divider)
      return <hr key={`divider-${i}`} className="navbar-divider" />;
    if (entry.to)
      return <Link key={entry.label} className="navbar-item" to={entry.to}>{entry.label}</Link>;
    if (isFunction(entry.onClick))
      return <a key={entry.label} className="navbar-item" onClick={e => (entry.onClick() && toggleMenu())}>{entry.label}</a>;
    if (isArray(entry.dropdown)) {
      return (
        <div key={entry.label} className="navbar-item has-dropdown is-active">
          <a className="navbar-link is-arrowless">
            {entry.label}
          </a>
          <div className="navbar-dropdown">
            {entry.dropdown.map(renderMenuEntry)}
          </div>
        </div>
      );
    }
  }

  return (
    <nav className="navbar is-spaced" role="navigation" aria-label="main navigation">
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

const mapStateToProps = state => ({
  currentPlayer: selectCurrentPlayer(state),
});

const mapDispatchToProps = (dispatch) => ({
  distribute: (tableId, playerId) => dispatch(distribute(tableId, playerId)),
  undo: (tableId) => dispatch(undo(tableId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Header);