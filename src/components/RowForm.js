import React, { useState } from "react";
import { Button, Checkbox, NumberField, TextField } from "react95";
import styled from "styled-components";

import { useTables } from "../contexts/Tables";

// (bigint can be handle as numeric)
const NUMERICS = ["int", "integer", "tinyint", "smallint", "mediumint"];

const StyledTable = styled.table`
  margin: 1rem 0;

  td {
    padding: 0.5rem 0.5rem;
    vertical-align: middle;
  }
`;

function renderInput({ field, value, setValue }) {
  const [type] = field.type.toLowerCase().split("(");

  if (NUMERICS.includes(type)) {
    return (
      <NumberField
        defaultValue={value}
        onChange={(value) => setValue(value)}
        width={300}
      />
    );
  }

  return (
    <TextField
      value={value}
      onChange={(event) => setValue(event.target.value)}
      style={{ width: 300 }}
    />
  );
}

export function RowForm({ row: initialRow, cancel, submit }) {
  const { currentTable } = useTables();
  const [row, setRow] = useState(initialRow);

  const updateField = (field) => (value) => {
    setRow({ ...row, [field]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    submit(row);
  };

  return (
    <form onSubmit={onSubmit}>
      <StyledTable style={{ width: "100%" }}>
        <tbody>
          {currentTable.structure.map((field) => {
            return (
              <tr key={field.name}>
                <td style={{ fontWeight: "bold" }}>{field.name}</td>
                <td>{field.type}</td>
                <td>
                  {renderInput({
                    field,
                    value: row[field.name],
                    setValue: updateField(field.name),
                  })}
                </td>
                <td>
                  <Checkbox label="NULL" disabled={!field.canBeNull} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </StyledTable>

      <p>
        <Button type="submit" style={{ marginRight: "0.5rem" }}>
          Submit
        </Button>
        {cancel && <Button onClick={cancel}>Cancel</Button>}
      </p>
    </form>
  );
}
