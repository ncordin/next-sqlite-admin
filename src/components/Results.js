import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableBody,
  TableDataCell,
  Checkbox,
  Panel,
} from "react95";

export function Results({ data }) {
  const headers = Array.isArray(data) ? Object.keys(data[0]) : [];
  const rows = Array.isArray(data) ? data : [];

  return (
    <>
      <Panel
        variant="well"
        style={{
          margin: "1rem 0 0.5rem 0",
          padding: "0.1rem 0.25rem",
          width: "100%",
        }}
      >
        {data.length} results
      </Panel>

      <Table>
        <TableHead>
          <TableRow head>
            <TableHeadCell></TableHeadCell>
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
                  <TableDataCell
                    key={`${index}-${valuesIndex}`}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {value}
                  </TableDataCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
