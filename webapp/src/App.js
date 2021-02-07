import React from 'react';

import { ErrorModalProvider } from './contexts/ErrorModal';
import { HtmlLayout } from './components/HtmlLayout';
import { DatabaseProvider } from './contexts/Database';
import { Desktop } from './screens/Desktop';

export function App() {
  return (
    <ErrorModalProvider>
      <DatabaseProvider>
        <HtmlLayout>
          <Desktop />
        </HtmlLayout>
      </DatabaseProvider>
    </ErrorModalProvider>
  );
}
