import React from "react";

import { useTables } from "../../contexts/Tables";
import { RowForm } from "../../components/RowForm";
import { useApi } from "../../utils/useApi";

export function InsertTab() {
  const { currentTable } = useTables();
  const { executeQuery } = useApi();

  const insertRow = async (row) => {
    const fields = currentTable.structure
      .map((structure) => `\`${structure.name}\``)
      .join(", ");

    const values = Object.values(row)
      .map((value) => `'${value}'`)
      .join(", ");

    const query = `INSERT INTO \`${currentTable.name}\` (${fields}) VALUES (${values});`;

    executeQuery(query);
  };

  return (
    <>
      <p style={{ fontWeight: "bold" }}>Insert new row</p>
      <RowForm row={{}} submit={insertRow} />
    </>
  );
}
