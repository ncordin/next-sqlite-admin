import React, { useState } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableBody,
  TableDataCell,
  TextField,
  Button,
  List,
} from "react95";

import { Layout } from "../components/Layout";
import { Results } from "../components/Results";
import { coolFetch } from "../utils/coolFetch";

export function IndexPage() {
  const [value, setValue] = useState("SELECT * FROM `players`;");
  const [response, setResponse] = useState(null);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const execute = async () => {
    const data = await coolFetch("api/sql", { sql: value });
    setResponse(data);
  };

  return (
    <Layout>
      <List style={{ width: "100%", padding: 16, marginBottom: 16 }}>
        <TextField
          multiline
          rows={5}
          defaultValue={value}
          fullWidth
          onChange={onChange}
          style={{ marginBottom: 8 }}
        />

        <Button onClick={execute}>Execute</Button>
      </List>

      {response && !response.error && <Results data={response} />}
      {response && response.error && (
        <List style={{ width: "100%", padding: 16, marginBottom: 16 }}>
          {response.error}
        </List>
      )}
    </Layout>
  );
}
