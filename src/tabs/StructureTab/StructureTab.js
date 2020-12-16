import React, { useState } from "react";
import { Button, Fieldset } from "react95";
import styled from "styled-components";
import { defaultField, NewFieldsForm } from "../../components/NewFieldsForm";
import { Null } from "../../components/Null";
import { Space } from "../../components/Space";
import { useTables } from "../../contexts/Tables";
import { CreateIndex } from "./CreateIndex";
import { ListIndex } from "./ListIndex";

const StyledTable = styled.table`
  margin: 1rem 0;
  width: 100%;

  td {
    padding: 0.5rem 0.5rem;
    vertical-align: middle;
  }
`;

function getDefaultValue(field) {
  if (field.defaultValue && field.canBeNull) {
    return (
      <span>
        <Null /> {field.defaultValue}
      </span>
    );
  }

  if (field.defaultValue) {
    return field.defaultValue;
  }

  if (field.canBeNull) {
    return <Null />;
  }

  return "⚠️";
}

export function StructureTab() {
  const { currentTable } = useTables();
  const [fields, setFields] = useState([defaultField]);

  return (
    <div>
      <Fieldset label="Fields">
        <StyledTable style={{ width: "100%" }}>
          <thead style={{ fontWeight: "bold" }}>
            <tr>
              <td>Name</td>
              <td>Type</td>
              <td>Default value</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {currentTable.structure.map((field) => {
              return (
                <tr key={field.name}>
                  <td style={{ fontWeight: "bold" }}>{field.name}</td>
                  <td>{field.type.toUpperCase()}</td>
                  <td>{getDefaultValue(field)}</td>
                  <td style={{ textAlign: "right" }}>rename - drop - move</td>
                </tr>
              );
            })}
          </tbody>
        </StyledTable>
      </Fieldset>

      <Space size={2} />

      <Fieldset label="Add field">
        <NewFieldsForm fields={fields} setFields={setFields} />
        <Button>Add field</Button>
      </Fieldset>

      <Space size={2} />

      <ListIndex />

      <Space size={2} />

      <CreateIndex />
    </div>
  );
}

/*
-- SQL:
DROP:   CREATE TABLE t2_backup AS SELECT age, id FROM t1;
ADD:    ALTER TABLE table_name ADD COLUMN column_definition;
RENAME: ALTER TABLE table_name RENAME COLUMN current_name TO new_name;
*/
