import React, { useEffect, useState } from "react";

import { InnerPanel } from "../../components/InnerPanel";
import { BrowseResults } from "./BrowseResults";
import { coolFetch } from "../../utils/coolFetch";
import { useErrorModal } from "../../contexts/ErrorModal";
import { useTables } from "../../contexts/Tables";
import { EditRow } from "./EditRow";

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
      const orderCommand = `${orderBy} ${orderByDirection ? "ASC" : "DESC"}`;
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

  if (editingRow) {
    return <EditRow row={editingRow} cancel={() => setEditingRow(null)} />;
  }

  return (
    <>
      <InnerPanel> {value}</InnerPanel>
      <InnerPanel>
        {response ? `${response.length} results` : "Loading..."}
      </InnerPanel>
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
