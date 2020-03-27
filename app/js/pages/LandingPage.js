import React, { useState } from 'react';

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
    <div className="container">
      <div className="has-text-centered">
        <h1 className="title is-1"><h1>Welcome to the coincheur Confiné !</h1></h1>
        <p className="subtitle">Jouez en ligne avec vos amis</p>
      </div>
      <div className="section">
        <form>
          <label>Choose a nickname</label>
          <input
            type="text"
            placeholder="Enter your nickname ..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </form>
        <button onClick={handleClick}>Create a table</button>
        <form>
          <label>Or join a table</label>
          <input
            type="text"
            placeholder="Enter the table id ..."
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
          />
          <button type="submit" onClick={handleSubmit}>JOIN</button>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;