import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Fieldset, Select, TextField } from 'react95';

import { InnerPanel } from '../../components/InnerPanel';
import { defaultField, NewFieldsForm } from '../../components/NewFieldsForm';
import { useTables } from '../../contexts/Tables';
import { makeCreateTable } from '../../utils/query';
import { useApi } from '../../utils/useApi';

export function CreateTableTab({ onCreated }) {
  const [tableName, setTableName] = useState('');
  const [fields, setFields] = useState([defaultField]);
  const { executeQuery } = useApi();
  const { refresh, tables, setCurrentTableName } = useTables();

  const onSubmit = async (event) => {
    event.preventDefault();
    const sql = makeCreateTable(tableName, fields);
    executeQuery(sql).then(refresh);
  };

  useEffect(() => {
    const newlyCreatedTable = tables.find((table) => table.name === tableName);

    if (newlyCreatedTable) {
      setCurrentTableName(newlyCreatedTable.name);
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
        <NewFieldsForm fields={fields} setFields={setFields} />
        <Button
          style={{ marginLeft: '0.5rem' }}
          onClick={() => setFields([...fields, defaultField])}
        >
          Add one more field
        </Button>
      </Fieldset>

      <Fieldset
        label="Primary key"
        style={{ marginBottom: 32, display: 'flex' }}
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
          style={{ marginRight: '0.5rem' }}
        >
          Create table
        </Button>
      </p>

      <InnerPanel>{makeCreateTable(tableName, fields)}</InnerPanel>
    </form>
  );
}
