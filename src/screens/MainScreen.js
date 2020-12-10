import React from "react";
import { Button, Toolbar, Bar, Tabs, Tab, TabBody } from "react95";
import styled from "styled-components";

import { Layout } from "../components/Layout";
import { TableList } from "../components/TableList";
import { ErrorModalProvider } from "../contexts/ErrorModal";
import { SqlTab } from "../tabs/SqlTab";

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  padding: 8px;
`;

export function MainScreen() {
  return (
    <ErrorModalProvider>
      <Layout title="Ma base de donnée">
        <Toolbar style={{ marginBottom: 16 }}>
          <Button variant="menu" size="sm">
            Database
          </Button>
          <Bar size={24} />
          <Button variant="menu" disabled size="sm">
            Logout
          </Button>
        </Toolbar>

        <FlexRow>
          <Column>
            <TableList />
          </Column>
          <Column style={{ flex: 1, paddingLeft: 8, paddingBottom: 50 }}>
            <Tabs value={1} onChange={() => null}>
              <Tab value={0}>Browse</Tab>
              <Tab value={1}>SQL</Tab>
              <Tab value={2}>Insert</Tab>
              <Tab value={3}>Structure</Tab>
              <Tab value={4}>Alter table</Tab>
            </Tabs>
            <TabBody>
              <SqlTab />
            </TabBody>
          </Column>
        </FlexRow>
      </Layout>
    </ErrorModalProvider>
  );
}
