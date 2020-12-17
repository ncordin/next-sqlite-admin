import React from "react";
import { Button, Window, WindowContent, WindowHeader } from "react95";
import styled from "styled-components";

const StyledWindow = styled(Window)`
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
  .window:nth-child(2) {
    margin: 2rem;
  }
`;

export function ClosableWindow({
  title,
  children,
  onClose,
  className = "",
  style = {},
}) {
  return (
    <StyledWindow className={className} style={style}>
      <WindowHeader className="window-header">
        <span>{title}</span>
        <Button onClick={onClose}>
          <span className="close-icon" />
        </Button>
      </WindowHeader>

      <WindowContent>{children}</WindowContent>
    </StyledWindow>
  );
}
