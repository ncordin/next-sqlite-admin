import { Panel } from 'react95';
import React from 'react';

export const InnerPanel = ({ children }) => (
  <Panel
    variant="well"
    style={{
      margin: '0.5rem 0',
      padding: '0.1rem 0.25rem',
      width: '100%',
    }}
  >
    {children}
  </Panel>
);
