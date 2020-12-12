import React from "react";
import { Button, Fieldset } from "react95";

import { useTables } from "../../contexts/Tables";
import { useApi } from "../../utils/useApi";

export function ManagementTab() {
  const { currentTable, refresh } = useTables();
  const { executeQuery } = useApi();

  const flushTable = async () => {
    await executeQuery(`DELETE FROM "${currentTable.name}";`);
    await refresh();
  };

  const dropTable = async () => {
    await executeQuery(`DROP TABLE "${currentTable.name}";`);
    await refresh();
  };

  return (
    <>
      <Fieldset label="Danger zone">
        <Button style={{ marginRight: 16 }} onClick={flushTable}>
          EMPTY TABLE `{currentTable.name}`
        </Button>
        <Button style={{ marginRight: 16 }} onClick={dropTable}>
          DELETE TABLE `{currentTable.name}`
        </Button>
      </Fieldset>
      <p style={{ padding: 16 }}>
        Vacuum / Primary key ? / Index ? / Dump / Describe1
      </p>
    </>
  );
}
