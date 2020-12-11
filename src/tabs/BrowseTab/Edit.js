import React from "react";

import { useTables } from "../../contexts/Tables";
import { RowForm } from "../../components/RowForm";

const makeSet = (row) => {
  return Object.keys(row)
    .map((key) => `\`${key}\` = '${row[key]}'`)
    .join(", ");
};

const makeWhere = (row) => {
  return Object.keys(row)
    .map((key) => `\`${key}\` = '${row[key]}'`)
    .join(" AND ");
};

export function Edit({ row, execute, cancel }) {
  const { currentTable } = useTables();

  const save = async (newRow) => {
    const set = makeSet(newRow);
    const where = makeWhere(row);
    const query = `UPDATE \`${currentTable.name}\` SET ${set} WHERE ${where}`;

    execute(query);
  };

  return (
    <>
      <p style={{ fontWeight: "bold" }}>Edit row</p>{" "}
      <RowForm row={row} cancel={cancel} submit={save} />
    </>
  );
}
