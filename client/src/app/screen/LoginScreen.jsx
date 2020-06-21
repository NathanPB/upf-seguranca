import React from 'react';
import PropTypes from 'prop-types';
import sha256 from 'crypto-js/sha256';

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

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
      <span className="p-float-label">
        <InputText
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="email">Email</label>
      </span>

      <span className="p-float-label" style={{ margin: '1em 0' }}>
        <Password
          id="pwd"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <label htmlFor="pwd">Password</label>
      </span>

      <Button
        label="Login"
        onClick={sendForm}
        icon="pi pi-angle-right"
        style={{ width: '100%' }}
      />
    </div>
  )
}

LoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired
}
