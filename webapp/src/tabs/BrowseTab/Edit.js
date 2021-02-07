import React, { useEffect, useState } from 'react';

import { useTables } from '../../contexts/Tables';
import { RowForm } from '../../components/RowForm';
import { InnerPanel } from '../../components/InnerPanel';
import { makeSet, makeWhere } from '../../utils/query';
import { Button, Fieldset } from 'react95';

export function Edit({ row, execute, cancel }) {
  const { currentTable } = useTables();
  const [editingRow, setEditingRow] = useState(row);
  const [showQuery, setShowQuery] = useState(false);

  const set = makeSet(editingRow);
  const where = makeWhere(row);
  const query = `UPDATE \`${currentTable.name}\` SET ${set} WHERE ${where}`;

  useEffect(() => {
    setEditingRow(row);
  }, [currentTable?.name]);

  const onSubmit = async (event) => {
    event.preventDefault();
    execute(query);
  };

  return (
    <form onSubmit={onSubmit}>
      <Fieldset label={`Editing ${currentTable.name}`}>
        <RowForm row={editingRow} onChange={setEditingRow} />
      </Fieldset>

      <div style={{ margin: '1rem 0' }}>
        <Button type="submit" style={{ marginRight: '0.5rem' }}>
          Update
        </Button>
        <Button onClick={cancel} style={{ marginRight: '0.5rem' }}>
          Cancel
        </Button>
        <Button onClick={() => setShowQuery(!showQuery)}>Show query</Button>
      </div>

      {showQuery && <InnerPanel>{query}</InnerPanel>}
    </form>
  );
}
