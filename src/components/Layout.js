import Head from "next/head";
import React from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { styleReset } from "react95";

import original from "react95/dist/themes/original";

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
  }
  html {
    font-size: 14px !important;
  }
  ${styleReset}
`;

const StyledLayout = styled.div`
  font-family: "ms_sans_serif";
  padding: 8px;
  padding-top: 50px;
`;

export function Layout({ children }) {
  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <Head>
          <title>Node SQLite Admin</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <StyledLayout>{children}</StyledLayout>
      </ThemeProvider>
    </>
  );
}
