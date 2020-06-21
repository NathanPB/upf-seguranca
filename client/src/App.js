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
  const [isTokenValid, setTokenValid] = React.useState(false);

  const api = create(token, {
    onTokenInvalid: () => {
      setTokenValid(false)
      setToken('')
    }
  })

  const checkTokenValid = React.useCallback(async () => token && await api.isTokenValid(), [ token, api ])

  React.useEffect(() => {
    checkTokenValid()
      .then(setTokenValid)
      .catch(() => setTokenValid(false))
  }, [ token, checkTokenValid ]);

  function router() {
    return (
      <BrowserRouter>
        <Route path="/">
          <HomeScreen api={api}/>
        </Route>
      </BrowserRouter>
    )
  }

  return (
    <div className="App">
      { isTokenValid ? router() : <LoginScreen onLogin={setToken} /> }
    </div>
  );
}

export default App;
