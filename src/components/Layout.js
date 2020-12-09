import Head from "next/head";
import React from "react";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: lightblue;
    font-family: Open-Sans, Helvetica, Sans-Serif;
  }
`;

const StyledLayout = styled.div`
  padding: 32px;
`;

export function Layout({ children }) {
  return (
    <>
      <GlobalStyle />
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StyledLayout>{children}</StyledLayout>
    </>
  );
}
