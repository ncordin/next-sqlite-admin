import React, { useState } from "react";
import { Button, Toolbar, Bar, Tabs, Tab, TabBody } from "react95";
import styled from "styled-components";

import { Layout } from "../components/Layout";
import { TableList } from "../components/TableList";
import { ErrorModalProvider } from "../contexts/ErrorModal";
import { TablesProvider } from "../contexts/Tables";
import { BrowseTab } from "../tabs/BrowseTab";
import { SqlTab } from "../tabs/SqlTab";

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  padding: 8px;
`;

const StyledTab = styled(Tab)`
  padding: 0 1.2rem;
`;

export function MainScreen() {
  const [currentTab, setCurrentTab] = useState("browse");

  const getTabBody = (value) => {
    switch (value) {
      case "browse":
        return <BrowseTab />;

      case "insert":
        return "INSERT";

      case "sql":
        return <SqlTab />;

      case "structure":
        return "STRUCTURE";

      case "alter":
        return "ALTER";
    }
  };

  return (
    <ErrorModalProvider>
      <TablesProvider>
        <Layout title="Ma base de donnée">
          <Toolbar style={{ marginBottom: 8 }}>
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
              <Tabs
                value={currentTab}
                onChange={(e, value) => setCurrentTab(value)}
              >
                <StyledTab value="browse">Browse</StyledTab>
                <StyledTab value="insert">Insert</StyledTab>
                <StyledTab value="sql">SQL</StyledTab>
                <StyledTab value="structure">Structure</StyledTab>
                <StyledTab value="alter">Alter table</StyledTab>
              </Tabs>
              <TabBody>{getTabBody(currentTab)}</TabBody>
            </Column>
          </FlexRow>
        </Layout>
      </TablesProvider>
    </ErrorModalProvider>
  );
}
