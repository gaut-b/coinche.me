import React, { useState } from 'react';
import Layout from '../components/Layout';

const LandingPage = (props) => {

  const [username, setUsername] = useState('');
  const [tableId, setTableId] = useState('');

  const handleClick = () => {
    fetch(`http://localhost:3000/join`, {
      method: 'post',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: `username=${username}`,
    })
    .then(res => res.json())
    .then((data) => {
      props.history.push(`/game/tableId=${data.tableId}&username=${username}`);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!tableId || !username) return;
    fetch(`http://localhost:3000/joinTable`, {
      method: 'post',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: `tableId=${tableId}&username=${username}`,
    })
    .then(res => res.json())
    .then(data => {
      props.history.push(`/game/${data.tableId}`);
    });
    setTableId('');
  };

  return (
    <Layout>
      <div className="columns">
        <div className="column is-6 is-offset-3">
          <form className="section has-text-centered" action="/join" method="post">
            <h1 className="title is-1">Bienvenue</h1>

            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label">Pseudo</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <p className="control">
                    <input className="input" type="text" placeholder="Choisis ton blase" value={username} onChange={e => setUsername(e.target.value)} />
                  </p>
                </div>
              </div>
            </div>
            <div className="section content">
              <div className="field">
                <button className="button is-primary" onClick={handleSubmit}>Créer une table</button>
              </div>
              <p className="has-text-centered">- OU -</p>
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input className="input" type="text" placeholder="Entrez un nom de table ..." value={tableId} onChange={(e) => setTableId(e.target.value)} />
                </div>
                <div className="control">
                  <button className="button is-primary" onClick={handleSubmit}>
                    Rejoindre
                  </button>
                </div>
            </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;