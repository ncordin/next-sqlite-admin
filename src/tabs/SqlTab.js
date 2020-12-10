import React, { useState } from "react";
import { TextField, Button } from "react95";

import { Results } from "../components/Results";
import { coolFetch } from "../utils/coolFetch";
import { useErrorModal } from "../contexts/ErrorModal";

export function SqlTab() {
  const [value, setValue] = useState("SELECT * FROM `players`;");
  const [response, setResponse] = useState(null);
  const { open } = useErrorModal();

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

      {response && !response.error && <Results data={response} />}
    </>
  );
}
