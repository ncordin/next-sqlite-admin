import React from "react";
import { Button, ListItem, Fieldset } from "react95";
import { useTables } from "../contexts/Tables";
import { BoldIf } from "./BoldIf";

export function TableList() {
  const { currentTable, setCurrentTable, tables, refresh } = useTables();

  return (
    <>
      <Button fullWidth style={{ marginBottom: 8 }}>
        New table
      </Button>
      <Button fullWidth style={{ marginBottom: 16 }} onClick={refresh}>
        Refresh tables
      </Button>
      <Fieldset label={`Tables (${tables.length})`} style={{ width: 200 }}>
        {tables.map((table) => {
          return (
            <ListItem
              key={table.name}
              size="sm"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setCurrentTable(table);
              }}
            >
              <BoldIf condition={table.name === currentTable.name}>
                {table.name} ({table.lines})
              </BoldIf>
            </ListItem>
          );
        })}
      </Fieldset>
    </>
  );
}
