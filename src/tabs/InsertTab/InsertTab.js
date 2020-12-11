import React from "react";

import { coolFetch } from "../../utils/coolFetch";
import { useErrorModal } from "../../contexts/ErrorModal";
import { useTables } from "../../contexts/Tables";
import { RowForm } from "../../components/RowForm";

export function InsertTab() {
  const { currentTable } = useTables();
  const { open } = useErrorModal();

  const insertRow = async (row) => {
    const fields = currentTable.structure
      .map((structure) => `\`${structure.name}\``)
      .join(", ");

    const values = Object.values(row)
      .map((value) => `'${value}'`)
      .join(", ");

    const query = `INSERT INTO \`${currentTable.name}\` (${fields}) VALUES (${values});`;

    const data = await coolFetch("api/sql", { sql: query });
    data.error && open("SQL error!", data.error);
  };

  return (
    <>
      <p style={{ fontWeight: "bold" }}>Insert new row</p>
      <RowForm row={{}} submit={insertRow} />
    </>
  );
}
