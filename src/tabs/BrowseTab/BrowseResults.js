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

const Null = () => {
  return <span style={{ fontStyle: "italic", opacity: 0.42 }}>NULL</span>;
};

export function BrowseResults({
  data,
  orderBy,
  changeOrderBy,
  selectEditingRow,
  selected,
  setSelected,
}) {
  const headers = data[0] ? Object.keys(data[0]) : [];
  const rows = Array.isArray(data) ? data : [];

  const changeSelection = (isSelected, index) => {
    if (isSelected) {
      setSelected([...selected, index]);
    } else {
      setSelected(selected.filter((value) => value !== index));
    }
  };

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
                <Checkbox
                  checked={selected.includes(index)}
                  onChange={(event) =>
                    changeSelection(event.target.checked, index)
                  }
                />
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
                  {value === null ? <Null /> : value}
                </TableDataCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
