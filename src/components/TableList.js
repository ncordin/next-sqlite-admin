import React, { useEffect, useState } from "react";
import { Button, ListItem, Fieldset } from "react95";

import { coolFetch } from "../utils/coolFetch";

export function TableList() {
  const [tables, setTables] = useState([]);
  const [currentTable, setCurrentTable] = useState("players");

  useEffect(() => {
    coolFetch("api/tables").then(setTables);
  }, []);

  return (
    <>
      <Button fullWidth style={{ marginBottom: 16 }}>
        New table
      </Button>
      <Fieldset label={`Tables (${tables.length})`} style={{ width: 200 }}>
        {tables.map((table) => {
          return (
            <ListItem
              key={table.name}
              size="sm"
              style={{ cursor: "pointer" }}
              disabled={table.name === currentTable}
              onClick={() => {
                setCurrentTable(table.name);
              }}
            >
              {table.name} ({table.lines})
            </ListItem>
          );
        })}
      </Fieldset>
    </>
  );
}
