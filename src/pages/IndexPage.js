import React, { useEffect, useState } from "react";
import {
  Window,
  WindowHeader,
  TextField,
  Button,
  List,
  ListItem,
  AppBar,
  Toolbar,
  Bar,
} from "react95";
import styled from "styled-components";

import { Layout } from "../components/Layout";
import { Results } from "../components/Results";
import { coolFetch } from "../utils/coolFetch";

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.div``;

export function IndexPage() {
  const [value, setValue] = useState("SELECT * FROM `players`;");
  const [response, setResponse] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    coolFetch("api/tables").then((response) => {
      console.log({ response });
      setTables(response);
    });
  }, []);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const execute = async (value) => {
    setValue(value);

    const data = await coolFetch("api/sql", { sql: value });
    setResponse(data);
  };

  return (
    <Layout>
      <AppBar>
        <Toolbar style={{}}>
          <Bar size={24} />
          <Button variant="menu" size="sm">
            Edit
          </Button>
          <Button variant="menu" disabled size="sm">
            Save
          </Button>
        </Toolbar>
      </AppBar>

      <FlexRow>
        <Column>
          <Window style={{ width: 190 }}>
            <WindowHeader>Tables ({tables.length})</WindowHeader>
            {/* <Button fullWidth style={{ margin: "4px 0" }}>
              Refresh
            </Button>
            <Divider style={{ margin: "4px 0" }} /> */}
            {tables.map((table) => {
              return (
                <ListItem
                  key={table.name}
                  size="sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => execute(`SELECT * FROM ${table.name};`)}
                >
                  {table.name}
                </ListItem>
              );
            })}
          </Window>
        </Column>
        <Column style={{ flex: 1, paddingLeft: 8 }}>
          <List style={{ width: "100%", padding: 8, marginBottom: 16 }}>
            <TextField
              multiline
              rows={5}
              value={value}
              fullWidth
              onChange={onChange}
              style={{ marginBottom: 8 }}
            />

            <Button onClick={() => execute(value)}>Execute</Button>
          </List>

          {response && !response.error && <Results data={response} />}
          {response && response.error && (
            <List style={{ width: "100%", padding: 8 }}>{response.error}</List>
          )}
        </Column>
      </FlexRow>
    </Layout>
  );
}
