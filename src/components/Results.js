import React, { useState } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableBody,
  TableDataCell,
  TextField,
  Button,
  List,
} from "react95";
export function Results({ data }) {
  const headers = Array.isArray(data) ? Object.keys(data[0]) : [];
  const rows = Array.isArray(data) ? data : [];

  return (
    <Window style={{ width: "100%" }}>
      <WindowHeader>{data.length} résultats</WindowHeader>
      <WindowContent>
        <Table>
          <TableHead>
            <TableRow head>
              {headers.map((header) => (
                <TableHeadCell key={header}>{header}</TableHeadCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const values = Object.values(row);

              return (
                <TableRow key={index}>
                  {values.map((value, valuesIndex) => (
                    <TableDataCell key={`${index}-${valuesIndex}`}>
                      {value}
                    </TableDataCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </WindowContent>
    </Window>
  );
}
