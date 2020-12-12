import React, { useEffect, useState } from "react";
import { useApi } from "../utils/useApi";

const initialState = {
  tables: [],
  currentTable: null,
};

const ReactContext = React.createContext(initialState);

function TablesProvider({ children }) {
  const [tables, setTables] = useState([]);
  const [currentTable, setCurrentTable] = useState(null);
  const { fetch } = useApi();

  useEffect(() => {
    fetch("api/tables").then((tables) => {
      setCurrentTable(tables[0] || null);
      setTables(tables);
    });
  }, []);

  const refresh = () => {
    return fetch("api/tables").then(setTables);
  };

  return (
    <ReactContext.Provider
      value={{
        tables,
        currentTable,
        setCurrentTable,
        refresh,
      }}
    >
      {children}
    </ReactContext.Provider>
  );
}

function useTables() {
  return React.useContext(ReactContext);
}

export { TablesProvider, useTables };
