import React, { useEffect, useState } from "react";

import { InnerPanel } from "../../components/InnerPanel";
import { BrowseResults } from "./BrowseResults";
import { coolFetch } from "../../utils/coolFetch";
import { useErrorModal } from "../../contexts/ErrorModal";
import { useTables } from "../../contexts/Tables";
import { EditRow } from "./EditRow";
import { Button } from "react95";
import styled from "styled-components";

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

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1.5rem;
`;

const FlexColumn = styled.div`
  margin-right: 1rem;
`;

export function BrowseTab() {
  const { currentTable } = useTables();
  const { open } = useErrorModal();

  const [value, setValue] = useState("");
  const [response, setResponse] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDirection, setOrderByDirection] = useState(true);
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    currentTable && execute(`SELECT * FROM \`${currentTable.name}\`;`);
    setEditingRow(null);
    setOrderBy(null);
    setOrderByDirection(null);
  }, [currentTable]);

  useEffect(() => {
    if (currentTable && orderBy) {
      const orderCommand = `\`${orderBy}\` ${
        orderByDirection ? "ASC" : "DESC"
      }`;
      const query = `SELECT * FROM \`${currentTable.name}\` ORDER BY ${orderCommand};`;

      execute(query);
    }
  }, [orderBy, orderByDirection]);

  const execute = async (value) => {
    setValue(value);

    const data = await coolFetch("api/sql", { sql: value });
    setResponse(data);

    data.error && open("SQL error!", data.error);
  };

  const changeOrderBy = (field) => {
    field === orderBy && setOrderByDirection(!orderByDirection);
    setOrderBy(field);
  };

  const saveRow = async (row) => {
    const set = makeSet(row);
    const where = makeWhere(editingRow);
    const query = `UPDATE \`${currentTable.name}\` SET ${set} WHERE ${where}`;

    const data = await coolFetch("api/sql", { sql: query });
    data.error && open("SQL error!", data.error);

    setEditingRow(null);
    execute(value);
  };

  if (editingRow) {
    return (
      <EditRow
        row={editingRow}
        cancel={() => setEditingRow(null)}
        submit={saveRow}
      />
    );
  }

  return (
    <>
      <InnerPanel> {value}</InnerPanel>

      <FlexRow>
        <FlexColumn>
          <Button onClick={() => execute(value)}>Refresh</Button>
        </FlexColumn>

        <InnerPanel>
          {response ? `${response.length} results` : "Loading..."}
        </InnerPanel>
      </FlexRow>
      {response && (
        <BrowseResults
          data={response}
          orderBy={orderBy}
          changeOrderBy={changeOrderBy}
          selectEditingRow={setEditingRow}
        />
      )}
    </>
  );
}
