import React, { useEffect, useState } from "react";
import { Button, Fieldset, TextField } from "react95";

import { useTables } from "../../contexts/Tables";
import { InnerPanel } from "../../components/InnerPanel";
import { useApi } from "../../utils/useApi";

export function ManagementTab() {
  const { currentTable, refresh } = useTables();
  const { executeQuery } = useApi();
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

  return (
    <>
      <form onSubmit={renameTable}>
        <Fieldset label="Rename table" style={{ marginBottom: 32 }}>
          <TextField
            value={newTableName}
            onChange={(event) => setNewTableName(event.target.value)}
          />
          <Button type="submit" style={{ marginTop: "0.5rem" }}>
            Rename
          </Button>
        </Fieldset>
      </form>

      <Fieldset label="Danger zone" style={{ marginBottom: "2rem" }}>
        <Button style={{ marginRight: 16 }} onClick={flushTable}>
          EMPTY TABLE `{currentTable.name}`
        </Button>
        <Button style={{ marginRight: 16 }} onClick={dropTable}>
          DELETE TABLE `{currentTable.name}`
        </Button>
      </Fieldset>
      <Fieldset label="SQL Describe" style={{ marginBottom: "2rem" }}>
        <InnerPanel>{currentTable.describe}</InnerPanel>
      </Fieldset>
      <p>Vacuum / Dump / Primary key ? / Index ?</p>
    </>
  );
}
