import React from 'react';
import { Button, Fieldset } from 'react95';
import { FlexRow } from '../../components/FlexRow';
import { useApi } from '../../utils/useApi';

export function ListIndex({ indexes, refreshIndexes, currentTable }) {
  const { executeQuery } = useApi();
  const primaryKey = currentTable.structure
    .filter((field) => field.isPrimaryKey)
    .map((field) => field.name);

  return (
    <Fieldset label="Indexes">
      {primaryKey && (
        <FlexRow between>
          <span>{primaryKey}</span>
          <span>primary key</span>
        </FlexRow>
      )}
      {indexes.map((index) => {
        const drop = async () => {
          await executeQuery(`DROP INDEX "${index.name}"`);
          refreshIndexes();
        };

        return (
          <FlexRow key={index.name} between>
            <span style={{ flexBasis: 200 }}>{index.name}</span>
            {index.unique ? 'unique' : ''}
            <Button onClick={drop}>Drop</Button>
          </FlexRow>
        );
      })}
    </Fieldset>
  );
}

// DROP INDEX index_name;
