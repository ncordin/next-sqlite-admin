import React, { useState } from 'react';

const initialState = {
  isOpen: false,
  title: '',
  message: '',
};

const ReactContext = React.createContext(initialState);

function ErrorModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const open = (title, message) => {
    setTitle(title);
    setMessage(message);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <ReactContext.Provider
      value={{
        isOpen,
        title,
        message,
        open,
        close,
      }}
    >
      {children}
    </ReactContext.Provider>
  );
}

function useErrorModal() {
  return React.useContext(ReactContext);
}

export { ErrorModalProvider, useErrorModal };
