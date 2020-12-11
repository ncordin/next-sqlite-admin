import React, { useState } from "react";
import { Button, Checkbox, TextField } from "react95";
import styled from "styled-components";

import { useTables } from "../contexts/Tables";

const StyledTable = styled.table`
  margin: 1rem 0;

  td {
    padding: 0 0.5rem;
    vertical-align: middle;
  }
`;

export function RowForm({ row: initialRow, cancel, submit }) {
  const { currentTable } = useTables();
  const [row, setRow] = useState(initialRow);

  const updateField = (field) => (event) => {
    setRow({ ...row, [field]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    submit(row);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <StyledTable style={{ width: "100%" }}>
          <tbody>
            {currentTable.structure.map((field) => {
              return (
                <tr key={field.name}>
                  <td style={{ fontWeight: "bold" }}>{field.name}</td>
                  <td>{field.type}</td>
                  <td>
                    <TextField
                      value={row && row[field.name]}
                      onChange={updateField(field.name)}
                    />
                  </td>
                  <td>
                    <Checkbox label="NULL" disabled />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </StyledTable>

        <p>
          <Button type="submit">Submit</Button>{" "}
          {cancel && <Button onClick={cancel}>Cancel</Button>}
        </p>
      </form>
    </div>
  );
}
