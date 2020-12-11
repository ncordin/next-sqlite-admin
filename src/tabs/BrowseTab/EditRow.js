import React from "react";
import { Button, Checkbox, TextField } from "react95";
import styled from "styled-components";

import { useTables } from "../../contexts/Tables";

const StyledTable = styled.table`
  margin: 1rem 0;

  td {
    padding: 0 0.5rem;
    vertical-align: middle;
  }
`;

export function EditRow({ row, cancel }) {
  const { currentTable } = useTables();

  return (
    <div>
      <p style={{ fontWeight: "bold" }}>Edit row</p>
      <StyledTable style={{ width: "100%" }}>
        <tbody>
          {currentTable.structure.map((field) => {
            return (
              <tr key={field.name}>
                <td style={{ fontWeight: "bold" }}>{field.name}</td>
                <td>{field.type}</td>
                <td>
                  <TextField value={row[field.name]} />
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
        <Button onClick={cancel}>Submit</Button>{" "}
        <Button onClick={cancel}>Cancel</Button>
      </p>
    </div>
  );
}
