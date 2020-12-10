import React from "react";
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
  Checkbox,
} from "react95";
export function Results({ data }) {
  const headers = Array.isArray(data) ? Object.keys(data[0]) : [];
  const rows = Array.isArray(data) ? data : [];

  return (
    <Window style={{ width: "100%" }}>
      <WindowHeader>{data.length} results</WindowHeader>
      <WindowContent>
        <Table>
          <TableHead>
            <TableRow head>
              <TableHeadCell>.</TableHeadCell>
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
                  <TableDataCell style={{ width: 28 }}>
                    <Checkbox />
                  </TableDataCell>

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
