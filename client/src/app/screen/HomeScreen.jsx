import React from 'react';
import { Button } from 'primereact/button';

export default function HomeScreen({ api }) {

  function handleRecheckToken() {
    api.isTokenValid()
      .then((valid) => {
        alert(valid ? "Your token still valid!" : "Your token is not valid anymore")
      }).catch(console.error)
  }

  return (
    <>
      <Button label="Re-check Token" onClick={handleRecheckToken}/>
      <div>
        Home
      </div>
    </>
  );
}
