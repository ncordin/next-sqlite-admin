import React, { useEffect, useState } from "react";
import { coolFetch } from "../utils/coolFetch";

const initialState = {
  tables: [],
  currentTable: null,
};

const ReactContext = React.createContext(initialState);

function TablesProvider({ children }) {
  const [tables, setTables] = useState([]);
  const [currentTable, setCurrentTable] = useState(null);

  useEffect(() => {
    coolFetch("api/tables").then((tables) => {
      setCurrentTable(tables[0] || null);
      setTables(tables);
    });
  }, []);

  const refresh = () => {
    coolFetch("api/tables").then(setTables);
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
