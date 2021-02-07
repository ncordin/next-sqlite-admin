import React, { useEffect, useState } from 'react';
import { TextField, Button, Panel } from 'react95';
import styled from 'styled-components';

import { SqlResults } from './SqlResults';
import { useTables } from '../../contexts/Tables';
import { useApi } from '../../utils/useApi';

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1.5rem;
`;

const FlexColumn = styled.div`
  margin-right: 1rem;
`;

export function SqlTab() {
  const { currentTable } = useTables();
  const [value, setValue] = useState(`SELECT * FROM \`${currentTable.name}\`;`);
  const [response, setResponse] = useState(null);
  const { executeQuery } = useApi();

  useEffect(() => {
    setValue(`SELECT * FROM \`${currentTable.name}\`;`);
  }, [currentTable.name]);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const execute = async (value) => {
    setValue(value);
    const response = await executeQuery(value);

    setResponse(response);
  };

  return (
    <>
      <TextField
        multiline
        rows={10}
        value={value}
        fullWidth
        onChange={onChange}
        style={{ marginBottom: 8 }}
      />

      <FlexRow>
        <FlexColumn>
          <Button onClick={() => execute(value)}>Execute</Button>
        </FlexColumn>

        <Panel
          variant="well"
          style={{
            padding: '0.1rem 0.25rem',
            width: '100%',
          }}
        >
          {`${response ? response.length : 0} results`}
        </Panel>
      </FlexRow>

      {response && response.length && !response.error ? (
        <SqlResults data={response} />
      ) : null}
    </>
  );
}
