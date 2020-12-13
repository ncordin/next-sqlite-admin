import React, { useState } from "react";
import { Fieldset } from "react95";

import { useTables } from "../../contexts/Tables";
import { RowForm } from "../../components/RowForm";
import { useApi } from "../../utils/useApi";
import { InnerPanel } from "../../components/InnerPanel";

export function InsertTab({ onCreated }) {
  const { currentTable, refresh } = useTables();
  const { executeQuery } = useApi();
  const [loggedQuery, setLoggedQuery] = useState(null);

  const insertRow = async (row) => {
    const fields = Object.keys(row)
      .map((name) => `\`${name}\``)
      .join(", ");

    const values = Object.values(row)
      .map((value) => `'${value}'`)
      .join(", ");

    const query = `INSERT INTO \`${currentTable.name}\` (${fields}) VALUES (${values});`;

    setLoggedQuery(query);

    executeQuery(query).then(() => {
      onCreated();
      refresh();
    });
  };

  return (
    <>
      <Fieldset label={`Insert new ${currentTable.name}`}>
        <RowForm row={{}} submit={insertRow} submitText="Insert" />
      </Fieldset>
      {loggedQuery && <InnerPanel>{loggedQuery}</InnerPanel>}
    </>
  );
}
