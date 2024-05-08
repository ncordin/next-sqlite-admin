import React from 'react';
import { useUrlParam } from '../utils/useUrlParam';

const ReactContext = React.createContext({
  database: null,
  setDatabase: null,
});

function DatabaseProvider({ children }) {
  const [database, setDatabase] = useUrlParam('database');

  return (
    <ReactContext.Provider
      value={{
        database,
        setDatabase,
      }}
    >
      {children}
    </ReactContext.Provider>
  );
}

function useDatabase() {
  return React.useContext(ReactContext);
}

export { DatabaseProvider, useDatabase };
