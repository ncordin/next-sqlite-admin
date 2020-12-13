import React, { useState } from "react";
import { Button, Fieldset } from "react95";

import { useTables } from "../../contexts/Tables";
import { RowForm } from "../../components/RowForm";
import { useApi } from "../../utils/useApi";
import { InnerPanel } from "../../components/InnerPanel";

export function InsertTab({ onCreated }) {
  const { currentTable, refresh } = useTables();
  const { executeQuery } = useApi();
  const [editingRow, setEditingRow] = useState({});
  const [showQuery, setShowQuery] = useState(false);

  const fields = Object.keys(editingRow)
    .map((name) => `\`${name}\``)
    .join(", ");

  const values = Object.values(editingRow)
    .map((value) => `'${value}'`)
    .join(", ");

  const query = `INSERT INTO \`${currentTable.name}\` (${fields}) VALUES (${values});`;

  const onSubmit = async (event) => {
    event.preventDefault();

    executeQuery(query).then(() => {
      onCreated();
      refresh();
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Fieldset label={`Insert into ${currentTable.name}`}>
        <RowForm row={editingRow} onChange={setEditingRow} />
      </Fieldset>

      <div style={{ margin: "1rem 0" }}>
        <Button type="submit" style={{ marginRight: "0.5rem" }}>
          Insert
        </Button>

        <Button onClick={() => setShowQuery(!showQuery)}>Show query</Button>
      </div>

      {showQuery && <InnerPanel>{query}</InnerPanel>}
    </form>
  );
}
