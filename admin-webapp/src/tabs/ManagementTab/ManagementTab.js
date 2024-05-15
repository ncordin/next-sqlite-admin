import React, { useEffect, useState } from 'react';
import { Button, Fieldset, TextField } from 'react95';

import { useTables } from '../../contexts/Tables';
import { InnerPanel } from '../../components/InnerPanel';
import { useApi } from '../../utils/useApi';
import { useDatabase } from '../../contexts/Database';

export function ManagementTab() {
  const { currentTable, refresh } = useTables();
  const { database } = useDatabase();
  const { executeQuery, download } = useApi();
  const [newTableName, setNewTableName] = useState(currentTable.name);

  useEffect(() => {
    setNewTableName(currentTable.name);
  }, [currentTable?.name]);

  const flushTable = async () => {
    await executeQuery(`DELETE FROM "${currentTable.name}";`);
    await refresh();
  };

  const dropTable = async () => {
    await executeQuery(`DROP TABLE "${currentTable.name}";`);
    await refresh();
  };

  const renameTable = async (event) => {
    event.preventDefault();

    await executeQuery(
      `ALTER TABLE "${currentTable.name}" RENAME TO "${newTableName}";`
    );
    await refresh();
  };

  const onDownload = async () => {
    const blob = await download(database);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = database;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <form onSubmit={renameTable}>
        <Fieldset
          label="Rename table"
          style={{ marginBottom: 32, padding: '2rem' }}
        >
          <TextField
            value={newTableName}
            onChange={(event) => setNewTableName(event.target.value)}
          />
          <Button type="submit" style={{ marginTop: '1rem' }}>
            Rename
          </Button>
        </Fieldset>
      </form>

      <Fieldset
        label="Export database"
        style={{ marginBottom: 32, padding: '2rem' }}
      >
        <Button onClick={onDownload} style={{ marginTop: '1rem' }}>
          Download a copy
        </Button>
      </Fieldset>

      <Fieldset
        label="Danger zone"
        style={{ marginBottom: '2rem', padding: '2rem' }}
      >
        <p style={{ marginBottom: '1rem' }}>
          <span style={{ fontWeight: 'bold' }}> {currentTable.name}</span> data
          will be lost!
        </p>
        <Button style={{ marginRight: 16 }} onClick={flushTable}>
          Empty table
        </Button>
        <Button style={{ marginRight: 16 }} onClick={dropTable}>
          Delete table
        </Button>
      </Fieldset>

      <Fieldset
        label="SQL Describe"
        style={{ marginBottom: '2rem', padding: '2rem' }}
      >
        <InnerPanel>{currentTable.describe}</InnerPanel>
      </Fieldset>
    </>
  );
}
