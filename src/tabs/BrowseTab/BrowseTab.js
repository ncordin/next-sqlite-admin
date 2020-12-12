import React, { useEffect, useState } from "react";
import { Button } from "react95";
import styled from "styled-components";

import { InnerPanel } from "../../components/InnerPanel";
import { BrowseResults } from "./BrowseResults";
import { useTables } from "../../contexts/Tables";
import { Edit } from "./Edit";
import { makeDelete } from "../../utils/query";
import { useApi } from "../../utils/useApi";

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1.5rem;
`;

const FlexColumn = styled.div`
  margin-right: 1rem;
  display: flex;
`;

export function BrowseTab() {
  const { currentTable } = useTables();
  const { executeQuery } = useApi();

  const [value, setValue] = useState("");
  const [response, setResponse] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [orderByDirection, setOrderByDirection] = useState(true);
  const [editingRow, setEditingRow] = useState(null);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    currentTable && execute(`SELECT * FROM \`${currentTable.name}\`;`);
    setEditingRow(null);
    setOrderBy(null);
    setOrderByDirection(null);
    setSelected([]);
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

    const data = await executeQuery(value);
    setResponse(data);
  };

  const changeOrderBy = (field) => {
    field === orderBy && setOrderByDirection(!orderByDirection);
    setOrderBy(field);
  };

  const saveRow = async (query) => {
    await executeQuery(query);

    setEditingRow(null);
    execute(value);
  };

  const deleteSelected = async () => {
    setSelected([]);
    const rows = selected.map((index) => response[index]);

    for (const row of rows) {
      const sql = makeDelete(currentTable.name, row);
      executeQuery(sql);
    }

    execute(value);
  };

  if (editingRow) {
    return (
      <Edit
        row={editingRow}
        cancel={() => setEditingRow(null)}
        execute={saveRow}
      />
    );
  }

  return (
    <>
      <InnerPanel> {value}</InnerPanel>

      <FlexRow>
        <FlexColumn>
          <Button onClick={() => execute(value)}>Refresh</Button>
          <Button
            onClick={deleteSelected}
            disabled={!selected.length}
            style={{ width: 150, marginLeft: 8 }}
          >
            Delete selected ({selected.length})
          </Button>
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
          selected={selected}
          setSelected={setSelected}
        />
      )}
    </>
  );
}
