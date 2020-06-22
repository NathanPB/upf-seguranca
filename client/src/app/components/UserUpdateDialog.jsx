import React from 'react';
import sha256 from 'crypto-js/sha256';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {ProgressSpinner} from 'primereact/progressspinner';

import Styles from './UserUpdateDialog.module.scss';

export default function UserUpdateDialog({ me, userId, api, notify, onCancelled, requestNotification }) {

  const [isLoading, setLoading] = React.useState(true);
  const [email, setEmail] = React.useState();
  const [createdAt, setCreatedAt] = React.useState();
  const [pwd, setPwd] = React.useState('');

  function handleError(e) {
    console.error(e);
    requestNotification({ severity: 'error', summary: 'Something went wrong', detail: 'Try Again Later' })
  }

  React.useEffect(() => {
    api.getUser(userId)
      .then(({ data }) => {
        const { email, createdAt } = JSON.parse(data);
        setEmail(email)
        setCreatedAt(createdAt)
        setLoading(false)
      }).catch(handleError)
  }, [api, userId])

  function handleDelete() {
    api.removeUser(userId)
      .then(() => {
        notify()
        requestNotification({ severity: 'warn', summary: 'User Removed Successfully'})
      }).catch(handleError)
  }

  function handleEdit() {
    let editPayload = { email }

    if (pwd) {
      editPayload = { ...editPayload, pwd: String(sha256(pwd)) }
    }

    api.editUser(userId, editPayload)
      .then(() => {
        notify()
        requestNotification({ severity: 'success', summary: 'Changes Saved Successfully'})
      }).catch((e) => {
        if (e.response.status === 409) {
          requestNotification({ severity: 'error', summary: 'Failed to save changes', detail: 'This e-mail address is already in use' })
        } else {
          handleError(e)
        }
      })
  }

  const footer = <div className="p-clearfix" style={{ width: '100%' }}>
    <Button label="Save" icon="pi pi-save" onClick={handleEdit}/>
    { me.id === userId && <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={handleDelete}/> }
  </div>

  const dialogBody = <div className="p-grid p-fluid">
        <span className="p-float-label">
          <InputText id="id" value={userId} readOnly/>
          <label htmlFor="id">Id</label>
        </span>
        <span className="p-float-label">
          <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value) } required />
          <label htmlFor="email">Email</label>
        </span>
    {
      me.id === userId && (
        <span className="p-float-label">
              <Password id="pwd" value={pwd} onChange={(e) => setPwd(e.target.value)} />
              <label htmlFor="pwd">Password</label>
            </span>
      )
    }
    <span className="p-float-label">
          <InputText id="created" value={createdAt} readOnly/>
          <label htmlFor="created">Created At</label>
        </span>
  </div>

  return <Dialog
    header="Edit User"
    onHide={onCancelled}
    className={Styles.UserUpdateDialog}
    footer={isLoading ? null : footer}
    visible
    modal
  >
    { isLoading ? <ProgressSpinner/> : dialogBody }
  </Dialog>
}
