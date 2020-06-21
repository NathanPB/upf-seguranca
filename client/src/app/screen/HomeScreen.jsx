import React from 'react';
import { Menubar } from 'primereact/menubar';
import { DataTable } from 'primereact/datatable';

import Styles from './HomeScreen.module.scss';
import {ProgressSpinner} from 'primereact/progressspinner';
import {Column} from 'primereact/column';

export default function HomeScreen({ api }) {

  const [me, setMe] = React.useState({});
  const [users, setUsers] = React.useState();

  // TODO find out why this is not automatically parsing the json string
  React.useEffect(() => {
    api.me()
      .then(({ data }) => setMe(JSON.parse(data)))
      .catch(console.error)

    api.users()
      .then(({ data }) => setUsers(JSON.parse(data)))
      .catch(console.error)
  }, [])

  function handleRecheckToken() {
    api.isTokenValid()
      .then((valid) => {
        alert(valid ? "Your token still valid!" : "Your token is not valid anymore")
      }).catch(console.error)
  }


  const menuItems = [
    {
      label: 'Recheck Token',
      icon: 'pi pi-refresh',
      command: handleRecheckToken,
      style: { background: 'var(--primaryColor)' }
    }
  ]

  const { email } = me;
  const isLoading = users === undefined;

  function renderTable() {
    return (
      <DataTable value={users}>
        <Column field="email" header="Email" sortable/>
        <Column field="createdAt" header="Creation Date" sortable/>
      </DataTable>
    )
  }

  return (
    <section className={Styles.HomeScreen}>
      <Menubar model={menuItems}>
        <span>Hello, {email}</span>
      </Menubar>
      <section className={Styles.PageBody}>
        { isLoading && <ProgressSpinner/> }
        { !isLoading && renderTable() }
      </section>
    </section>
  );
}
