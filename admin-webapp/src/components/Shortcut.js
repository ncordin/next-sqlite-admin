import React from 'react';
import styled from 'styled-components';

// @ts-ignore
import computer from '../assets/computer.png';
// @ts-ignore
import database from '../assets/database.png';
// @ts-ignore
import bin from '../assets/bin.png';

const icons = {
  computer,
  database,
  bin,
};

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
        <img
          src={icons[icon] ? icons[icon] : bin}
          alt={name}
          width="32"
          height="32"
        />
      </div>
      {name}
    </Container>
  );
}
