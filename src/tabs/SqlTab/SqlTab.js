import React, { useEffect, useState } from "react";
import { TextField, Button } from "react95";

import { SqlResults } from "./SqlResults";
import { coolFetch } from "../../utils/coolFetch";
import { useErrorModal } from "../../contexts/ErrorModal";
import { useTables } from "../../contexts/Tables";

export function SqlTab() {
  const { currentTable } = useTables();
  const [value, setValue] = useState(`SELECT * FROM \`${currentTable.name}\`;`);
  const [response, setResponse] = useState(null);
  const { open } = useErrorModal();

  useEffect(() => {
    setValue(`SELECT * FROM \`${currentTable.name}\`;`);
  }, [currentTable.name]);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const execute = async (value) => {
    setValue(value);

    const data = await coolFetch("api/sql", { sql: value });
    setResponse(data);

    data.error && open("SQL error!", data.error);
  };

  return (
    <>
      <TextField
        multiline
        rows={5}
        value={value}
        fullWidth
        onChange={onChange}
        style={{ marginBottom: 8 }}
      />

      <Button onClick={() => execute(value)}>Execute</Button>

      {response && !response.error && <SqlResults data={response} />}
    </>
  );
}
