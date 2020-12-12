import React, { useEffect, useState } from "react";
import { Button, Checkbox, Fieldset, Select, TextField } from "react95";
import styled from "styled-components";

import { InnerPanel } from "../../components/InnerPanel";
import { useTables } from "../../contexts/Tables";
import { makeCreateTable } from "../../utils/query";
import { useApi } from "../../utils/useApi";

const StyledTable = styled.table`
  margin: 1rem 0;

  td {
    padding: 0.5rem;
    vertical-align: middle;
  }
`;

const typeOptions = [
  { value: "INTEGER", label: "INTEGER" },
  { value: "TEXT", label: "TEXT" },
  { value: "REAL", label: "REAL" },
];

const defaultField = {
  name: "",
  type: "INTEGER",
  canBeNull: false,
  defaultValue: null,
  primaryKey: false,
  autoIncrement: false,
};

export function CreateTableTab({ onCreated }) {
  const [tableName, setTableName] = useState("");
  const [fields, setFields] = useState([defaultField]);
  const { executeQuery } = useApi();
  const { refresh, tables, setCurrentTable } = useTables();

  const onSubmit = async (event) => {
    event.preventDefault();

    const sql = makeCreateTable(tableName, fields);

    executeQuery(sql).then(refresh);
  };

  useEffect(() => {
    const newlyCreatedTable = tables.find((table) => table.name === tableName);

    if (newlyCreatedTable) {
      setCurrentTable(newlyCreatedTable);
      onCreated();
    }
  }, [tables]);

  const hasAutoIncrement = fields.some((field) => field.autoIncrement);

  return (
    <form onSubmit={onSubmit}>
      <Fieldset label="Table name" style={{ marginBottom: 32 }}>
        <TextField
          value={tableName}
          onChange={(event) => setTableName(event.target.value)}
        />
      </Fieldset>

      <Fieldset label="Table fields" style={{ marginBottom: 32 }}>
        <StyledTable style={{ width: "100%" }}>
          <thead>
            <tr>
              <td>Field name</td>
              <td>Field type</td>
              <td>Allow null</td>
              <td>Default value</td>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => {
              const updateField = (property, value) => {
                const newFields = [...fields];
                newFields[index] = { ...field, [property]: value };

                setFields(newFields);
              };

              return (
                <tr key={index}>
                  <td>
                    <TextField
                      value={field.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Select
                      options={typeOptions}
                      value={field.type}
                      width={160}
                      onChange={(event) =>
                        updateField("type", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Checkbox
                      label=""
                      checked={field.canBeNull}
                      onChange={(event) =>
                        updateField("canBeNull", event.target.checked)
                      }
                    />
                  </td>
                  <td style={{ display: "flex" }}>
                    <Checkbox
                      label=""
                      checked={field.defaultValue !== null}
                      onChange={(event) =>
                        updateField(
                          "defaultValue",
                          event.target.checked ? "" : null
                        )
                      }
                    />
                    <TextField
                      value={field.defaultValue || ""}
                      disabled={field.defaultValue === null}
                      onChange={(event) =>
                        updateField("defaultValue", event.target.value)
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </StyledTable>
        <Button
          style={{ marginLeft: "0.5rem" }}
          onClick={() => setFields([...fields, defaultField])}
        >
          Add one more field
        </Button>
      </Fieldset>

      <Fieldset
        label="Primary key"
        style={{ marginBottom: 32, display: "flex" }}
      >
        <Select
          style={{ marginRight: 16 }}
          options={fields.map((field) => ({
            value: field.name,
            label: field.name,
          }))}
          value={fields.find((field) => field.primaryKey)?.name}
          width={160}
          onChange={(event) => {
            setFields(
              fields.map((field) => ({
                ...field,
                primaryKey: event.target.value === field.name,
              }))
            );
          }}
        />

        <Checkbox
          label="Auto increment"
          checked={hasAutoIncrement}
          disabled={!fields.find((field) => field.primaryKey)}
          onChange={(event) => {
            setFields(
              fields.map((field) => ({
                ...field,
                autoIncrement: event.target.checked && field.primaryKey,
              }))
            );
          }}
        />
      </Fieldset>

      <p style={{ marginBottom: 16 }}>
        <Button
          type="submit"
          disabled={!tableName}
          style={{ marginRight: "0.5rem" }}
        >
          Create table
        </Button>
      </p>

      <InnerPanel>{makeCreateTable(tableName, fields)}</InnerPanel>
    </form>
  );
}
