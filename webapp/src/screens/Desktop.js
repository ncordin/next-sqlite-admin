import React, { useEffect, useState } from 'react';

import { MainScreen } from '../screens/MainScreen';
import { Shortcut } from '../components/Shortcut';
import { useDatabase } from '../contexts/Database';
import { TablesProvider } from '../contexts/Tables';
import { useApi } from '../utils/useApi';

export function Desktop() {
  const { database, setDatabase } = useDatabase();
  const { fetch } = useApi();
  const [databases, setDatabases] = useState([]);

  useEffect(() => {
    fetch('api/files').then((response) => {
      setDatabases(response);
    });
  }, []);

  return (
    <>
      {database && (
        <TablesProvider>
          <MainScreen onClose={() => setDatabase(null)} />
        </TablesProvider>
      )}
      {!database && (
        <>
          <Shortcut icon="computer" name="Explore" onClick={() => null} />

          {databases.map((file) => (
            <Shortcut
              key={file}
              icon="database"
              name={file}
              onClick={() => setDatabase(file)}
            />
          ))}
        </>
      )}
    </>
  );
}
