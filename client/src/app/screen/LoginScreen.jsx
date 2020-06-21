import React from 'react';
import PropTypes from 'prop-types';
import sha256 from 'crypto-js/sha256';

import { auth } from '../../services/api';

export default function LoginScreen({ onLogin }) {

  const [email, setEmail] = React.useState('')
  const [pwd, setPwd] = React.useState('')

  function handleError(error) {
    if (error.response.status === 403) {
      alert("Email ou Senha Inválidos")
      setPwd('')
    } else {
      alert("Oops! Algo errado ocorreu. Tente novamente mais tarde")
      console.error(error)
    }
  }

  function sendForm() {
    auth(email, String(sha256(pwd)))
    .then(({ data }) => onLogin(data.token))
    .catch(handleError)
  }

  return (
    <div>
      <div>
        <label>Email:</label><br/>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div>
        <label>Password:</label><br/>
        <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required/>
      </div>
      <input type="submit" value="Login" onClick={sendForm}/>
    </div>
  )
}

LoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired
}
