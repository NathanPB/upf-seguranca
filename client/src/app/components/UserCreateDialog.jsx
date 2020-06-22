import React from 'react';

import sha256 from 'crypto-js/sha256';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';

import Styles from './UserUpdateDialog.module.scss';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';

export default function UserCreateDialog({ api, visible, notify, onCancelled }) {

  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [confirmPwd, setConfirmPwd] = React.useState('');

  const formRef = React.useRef();

  function handleCancel() {
    setEmail('');
    setPwd('');
    setConfirmPwd('');
    onCancelled();
  }

  function handleCreate() {
    if (email && pwd && pwd === confirmPwd) {
      api.addUser({ email, pwd: String(sha256(pwd)) })
        .then(notify)
        .catch(console.error)
    }
  }

  const footer = <div className="p-clearfix" style={{ width: '100%' }}>
    <Button label="Register" icon="pi pi-save" className="p-button-success" onClick={handleCreate}/>
    <Button label="Cancel" className="p-button-secondary" onClick={handleCancel}/>
  </div>

  return (
    <Dialog
      header="Register New User"
      className={Styles.UserUpdateDialog}
      onHide={handleCancel}
      visible={visible}
      footer={footer}
      modal
    >
      <div className="p-grid p-fluid">
        <span className="p-float-label">
          <InputText
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="email">Email</label>
        </span>
        { !email && <span className={Styles.FormErrorMessage}>The email must not be blank</span> }

        <span className="p-float-label">
          <Password
            id="pwd"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
          <label htmlFor="pwd">Password</label>
        </span>
        { !pwd && <span className={Styles.FormErrorMessage}>The password must not be blank</span> }

        { pwd && (
          <>
            <span className="p-float-label">
              <InputText
                id="confirmPwd"
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                autoComplete={false}
                required
              />
              <label htmlFor="confirmPwd">Confirm Password</label>
            </span>
            { pwd !== confirmPwd && <span className={Styles.FormErrorMessage}>The passwords must match</span> }
          </>
        ) }
      </div>
    </Dialog>
  )
}
