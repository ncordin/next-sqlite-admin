import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, TextField } from 'react95';
import { ClosableWindow } from '../components/ClosableWindow';
import { Space } from '../components/Space';
import { usePassword } from '../contexts/Password';

const Container = styled.div`
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
`;

const Flex = styled.div`
  display: flex;
  width: 100%;
`;

const LargeButton = styled(Button)`
  width: 100px;
`;

export function Login() {
  const [localPassword, setLocalPassword] = useState('');
  const { setPassword } = usePassword();

  return (
    <Container>
      <ClosableWindow
        title="Enter Admin password"
        onClose={() => null}
        style={{ width: 600, minHeight: 200 }}
      >
        <Flex>
          <img src="./assets/keys.ico" height="40" width="40" />

          <table style={{ flex: 1, margin: '0 32px' }}>
            <tbody>
              <tr style={{ height: 42 }}>
                <td>Username:</td>
                <td>
                  <TextField value="admin" onChange={() => null} disabled />
                </td>
              </tr>
              <tr>
                <td>Password:</td>
                <td>
                  <TextField
                    type="password"
                    value={localPassword}
                    onChange={(event) => setLocalPassword(event.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <section>
            <LargeButton onClick={() => setPassword(localPassword)}>
              Ok
            </LargeButton>
            <Space vertical />
            <LargeButton onClick={() => null} disabled>
              Cancel
            </LargeButton>
          </section>
        </Flex>
      </ClosableWindow>
    </Container>
  );
}
