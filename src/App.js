import React from "react";

import { ErrorModalProvider } from "./contexts/ErrorModal";
import { TablesProvider } from "./contexts/Tables";
import { HtmlLayout } from "./components/HtmlLayout";
import { DatabaseProvider } from "./contexts/Database";
import { Desktop } from "./screens/Desktop";

export function App() {
  return (
    <ErrorModalProvider>
      <TablesProvider>
        <DatabaseProvider>
          <HtmlLayout>
            <Desktop />
          </HtmlLayout>
        </DatabaseProvider>
      </TablesProvider>
    </ErrorModalProvider>
  );
}
