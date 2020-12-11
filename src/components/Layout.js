import Head from "next/head";
import React from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { styleReset, Window, WindowHeader } from "react95";
import original from "react95/dist/themes/original";

import { useErrorModal } from "../contexts/ErrorModal";
import { ErrorModal } from "./ErrorModal";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('ms_sans_serif.woff2') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('ms_sans_serif_bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal
  }
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
  }
`;

const StyledLayout = styled.div`
  font-family: "ms_sans_serif";
  padding: 16px;
`;

export function Layout({ title, children }) {
  const { isOpen, title: titleModal, message, close } = useErrorModal();

  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <Head>
          <title>SQLite 95</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <StyledLayout>
          <Window style={{ minWidth: "100%" }}>
            <WindowHeader>{title}</WindowHeader>
            {children}
          </Window>
        </StyledLayout>
        {isOpen && (
          <ErrorModal title={titleModal} onClose={close}>
            {message}
          </ErrorModal>
        )}
      </ThemeProvider>
    </>
  );
}
