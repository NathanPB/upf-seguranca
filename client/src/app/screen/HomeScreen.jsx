import React from 'react';
import { Menubar } from 'primereact/menubar';
import { DataTable } from 'primereact/datatable';

import Styles from './HomeScreen.module.scss';
import {ProgressSpinner} from 'primereact/progressspinner';
import {Column} from 'primereact/column';
import {Calendar} from 'primereact/calendar';

export default function HomeScreen({ api }) {

  const tableRef = React.useRef();

  const [me, setMe] = React.useState({});
  const [users, setUsers] = React.useState();

  const [datesFilter, setDatesFilter] = React.useState([]);

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

  React.useEffect(() => {
    tableRef.current && tableRef.current.filter(datesFilter, 'createdAt', 'custom')
  }, [ datesFilter ])


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

  function dateRangeFilter(value) {
    if (datesFilter[0] && datesFilter[1]) {
      value = new Date(value);
      value.setHours(0);
      value.setMinutes(0);

      const max = new Date(+datesFilter[1] + 86400000)
      return +value >= +datesFilter[0] && +value <= +max
    } else {
      return true;
    }
  }

  const rangedDatePicker = <div className="p-inputgroup">
    <Calendar
      id="filterCalendar"
      placeholder="Filter by Date"
      maxDate={new Date()}
      value={datesFilter}
      onChange={({ value }) => setDatesFilter(value)}
      selectionMode="range"
      style={{ width: '100%' }}
      inputStyle={{ width: '100%' }}
      readOnlyInput
    />
    <span
      className="p-inputgroup-addon"
      title="Clear"
      onClick={() => setDatesFilter([])}
      style={{ cursor: 'pointer' }}
    >Clear</span>
  </div>

  function renderTable() {
    return (
      <DataTable value={users} ref={tableRef} emptyMessage="No Users Found">
        <Column
          field="email"
          header="Email"
          filterPlaceholder="Search by Email"
          filterMatchMode="contains"
          sortable
          filter
        />
        <Column
          field="createdAt"
          header="Creation Date"
          filterElement={rangedDatePicker}
          filterFunction={dateRangeFilter}
          sortable
          filter
        />
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
