import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import 'primereact/resources/themes/nova-dark/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import logo from './logo.svg';
import './App.css';
import LoginScreen from './app/screen/LoginScreen';
import HomeScreen from './app/screen/HomeScreen';

import { create } from './services/api'

function App() {

  const [token, setToken] = React.useState('')

  async function checkTokenValid() {
    return token && await create(token).isTokenValid()
  }

  const [isTokenValid, setTokenValid] = React.useState(false);

  React.useEffect(() => {
    checkTokenValid()
      .then(setTokenValid)
      .catch(() => setTokenValid(false))
  }, [ token ]);

  function router() {
    return (
      <BrowserRouter>
        <Route path="/">
          <HomeScreen token={token}/>
        </Route>
      </BrowserRouter>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <section>
          { isTokenValid ? router() : <LoginScreen onLogin={setToken} /> }
        </section>
      </header>
    </div>
  );
}

export default App;
