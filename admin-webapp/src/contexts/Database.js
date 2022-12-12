import React, { useState } from 'react';

const ReactContext = React.createContext({
  database: null,
  setDatabase: null,
});

function DatabaseProvider({ children }) {
  const [database, setDatabase] = useState(null);

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
