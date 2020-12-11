import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableBody,
  TableDataCell,
  Checkbox,
  Anchor,
} from "react95";

import { BoldIf } from "../../components/BoldIf";

export function BrowseResults({
  data,
  orderBy,
  changeOrderBy,
  selectEditingRow,
}) {
  const headers = data[0] ? Object.keys(data[0]) : [];
  const rows = Array.isArray(data) ? data : [];

  if (data.length === 0) {
    return null;
  }

  return (
    <Table>
      <TableHead>
        <TableRow head>
          <TableHeadCell></TableHeadCell>
          <TableHeadCell></TableHeadCell>
          {headers.map((header) => (
            <TableHeadCell
              key={header}
              onClick={() => changeOrderBy(header)}
              style={{ cursor: "pointer" }}
            >
              <BoldIf condition={orderBy === header}>{header}</BoldIf>
            </TableHeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => {
          const values = Object.values(row);

          return (
            <TableRow key={index}>
              <TableDataCell style={{ width: 40 }}>
                <Checkbox />
              </TableDataCell>
              <TableDataCell style={{ width: 40 }}>
                <Anchor
                  style={{ cursor: "pointer" }}
                  onClick={() => selectEditingRow(row)}
                >
                  edit
                </Anchor>
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
  );
}
