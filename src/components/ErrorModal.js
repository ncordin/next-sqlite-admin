import React from "react";
import styled from "styled-components";
import { Button, Window, WindowContent, WindowHeader } from "react95";

const Container = styled.div`
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  .window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: -1px;
    margin-top: -1px;
    transform: rotateZ(45deg);
    position: relative;
    &:before,
    &:after {
      content: "";
      position: absolute;
      background: black;
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .window {
    width: 400px;
    min-height: 200px;
  }
  .window:nth-child(2) {
    margin: 2rem;
  }
`;

const Icon = styled.span`
  display: inline-block;
  font-size: 2rem;
  margin-right: 1rem;
`;

export function ErrorModal({ title, children, onClose }) {
  return (
    <Container>
      <Window className="window">
        <WindowHeader className="window-header">
          <span>{title}</span>
          <Button onClick={onClose}>
            <span className="close-icon" />
          </Button>
        </WindowHeader>

        <WindowContent>
          <Icon>❌</Icon>
          {children}
        </WindowContent>
      </Window>
    </Container>
  );
}
