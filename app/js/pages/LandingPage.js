import React, { useState } from 'react';
import Layout from '../components/Layout';

const LandingPage = (props) => {

  const [username, setUsername] = useState('');
  const [tableId, setTableId] = useState('');

  const handleClick = () => {
    fetch(`http://localhost:3000/createTable`, {
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
      props.history.push(`/game/tableId=${data.tableId}&username=${username}`);
    });
    setTableId('');
  };

  return (
    <Layout>
      <div className="columns">
        <div className="column is-6 is-offset-3">
          <form className="section">
            <div className="field">
              <label className="label">Choose a nickname</label>
              <input
                className='input'
                type="text"
                placeholder="Enter your nickname ..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="field">
              <button className="button is-primary is-rounded" onClick={handleClick}>Create a table</button>
            </div>
          </form>
          <p className="has-text-centered">- OR -</p>
          <form className="section">
            <div className="field">
              <label className="label">Or join a table</label>
              <input
                className="input"
                type="text"
                placeholder="Enter the table id ..."
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
              />
            </div>
            <div className="field">
              <button className="button is-primary is-rounded" type="submit" onClick={handleSubmit}>JOIN</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;