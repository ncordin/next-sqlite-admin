import React from "react";

import { MainScreen } from "./screens/MainScreen";
import { ErrorModalProvider } from "./contexts/ErrorModal";
import { TablesProvider } from "./contexts/Tables";

export function App() {
  return (
    <ErrorModalProvider>
      <TablesProvider>
        <MainScreen />
      </TablesProvider>
    </ErrorModalProvider>
  );
}
