import React, { useState } from 'react';

const ReactContext = React.createContext({
  password: null,
  setPassword: null,
  logout: () => null,
});

function PasswordProvider({ children }) {
  const [password, setPassword] = useState(null);
  const logout = () => setPassword('');

  return (
    <ReactContext.Provider
      value={{
        password,
        setPassword,
        logout,
      }}
    >
      {children}
    </ReactContext.Provider>
  );
}

function usePassword() {
  return React.useContext(ReactContext);
}

export { PasswordProvider, usePassword };
