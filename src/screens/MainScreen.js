import React, { useEffect, useState } from "react";
import { Button, Toolbar, Bar, Tabs, Tab, TabBody } from "react95";
import styled from "styled-components";

import { Layout } from "../components/Layout";
import { TableList } from "../components/TableList";
import { BrowseTab } from "../tabs/BrowseTab";
import { InsertTab } from "../tabs/InsertTab/InsertTab";
import { SqlTab } from "../tabs/SqlTab";
import { CreateTableTab } from "../tabs/CreateTableTab";
import { ManagementTab } from "../tabs/ManagementTab/ManagementTab";
import { useTables } from "../contexts/Tables";
import { EmptyTab } from "../tabs/EmptyTab";

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
  const { currentTable } = useTables();

  useEffect(() => {
    if (currentTab === "create-table") {
      setCurrentTab("browse");
    }
  }, [currentTable?.name]);

  const getTabBody = (value) => {
    switch (value) {
      case "browse":
        return <BrowseTab />;

      case "insert":
        return <InsertTab onCreated={() => setCurrentTab("browse")} />;

      case "sql":
        return <SqlTab />;

      case "alter":
        return "ALTER";

      case "management":
        return <ManagementTab />;

      case "create-table":
        return <CreateTableTab onCreated={() => setCurrentTab("browse")} />;

      default:
        return <EmptyTab />;
    }
  };

  return (
    <Layout title="SQLite 95 - myDatabase.db">
      <Toolbar
        style={{ marginBottom: 8, position: "relative", top: -4, left: -4 }}
      >
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
          <TableList createTable={() => setCurrentTab("create-table")} />
        </Column>
        <Column style={{ flex: 1, paddingLeft: 8, paddingBottom: 50 }}>
          <Tabs
            value={currentTab}
            onChange={(e, value) => setCurrentTab(value)}
          >
            <StyledTab value="browse">Browse</StyledTab>
            <StyledTab value="insert">Insert</StyledTab>
            <StyledTab value="sql">SQL</StyledTab>
            <StyledTab value="alter">Structure</StyledTab>
            <StyledTab value="management">Management</StyledTab>
          </Tabs>
          <TabBody>
            {getTabBody(
              (currentTable || currentTab === "create-table") && currentTab
            )}
          </TabBody>
        </Column>
      </FlexRow>
    </Layout>
  );
}
