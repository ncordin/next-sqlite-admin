import React from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { styleReset } from "react95";
// import original from "react95/dist/themes/original";
import original from "react95/dist/themes/tokyoDark";

import { useErrorModal } from "../contexts/ErrorModal";
import { ErrorModal } from "./ErrorModal";

const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'ms_sans_serif';
    background-color: teal;
    height: 100vh;
  }
  html {
    font-size: 14px !important;
  }
  ${styleReset}
  * {
    box-sizing: border-box;
    letter-spacing: 0.5px;
  }
`;

const StyledLayout = styled.div`
  font-family: "ms_sans_serif";
`;

export function HtmlLayout({ children }) {
  const { isOpen, title: titleModal, message, close } = useErrorModal();

  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <StyledLayout>{children}</StyledLayout>
        {isOpen && (
          <ErrorModal title={titleModal} onClose={close}>
            {message}
          </ErrorModal>
        )}
      </ThemeProvider>
    </>
  );
}
