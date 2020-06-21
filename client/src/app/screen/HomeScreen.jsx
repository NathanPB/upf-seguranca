import React from 'react';
import { Menubar } from 'primereact/menubar';

import Styles from './HomeScreen.module.scss';

export default function HomeScreen({ api }) {

  const [me, setMe] = React.useState({});

  // TODO find out why this is not automatically parsing the json string
  React.useEffect(() => {
    api.me()
      .then(({ data }) => setMe(JSON.parse(data)))
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

  return (
    <section className={Styles.HomeScreen}>
      <Menubar model={menuItems}>
        <span>Hello, {email}</span>
      </Menubar>
    </section>
  );
}
