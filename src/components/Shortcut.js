import React from "react";
import styled from "styled-components";
import Image from "next/image";

const Container = styled.div`
  display: inline-block;
  padding: 2rem;
  text-align: center;
  color: white;
  cursor: pointer;
`;

export function Shortcut({ icon, name, onClick }) {
  return (
    <Container onClick={onClick}>
      <div>
        <Image
          src={`${process.env.basePath}/${icon}.png`}
          alt={name}
          width="32"
          height="32"
        />
      </div>
      {name}
    </Container>
  );
}
