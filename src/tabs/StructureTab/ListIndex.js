import React, { useEffect, useState } from "react";
import { Fieldset } from "react95";
import { useTables } from "../../contexts/Tables";
import { useApi } from "../../utils/useApi";

export function ListIndex() {
  const { currentTable } = useTables();
  const { executeQuery } = useApi();
  const [indexes, setIndexes] = useState([]);

  useEffect(() => {
    executeQuery(`PRAGMA index_list(${currentTable.name});`).then(setIndexes);
  }, [currentTable?.name]);

  return (
    <Fieldset label="Indexes">
      Name / Origin / Partial / Seq / Unique
      {indexes.map((index) => (
        <div key={index.name}>
          {index.name} {index.origin} {index.partial} {index.seq} {index.unique}
        </div>
      ))}
    </Fieldset>
  );
}

// Index : Name | field[] | unique
// DROP INDEX index_name;
