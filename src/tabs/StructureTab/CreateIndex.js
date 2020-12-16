import React, { useEffect, useState } from "react";
import { Button, Checkbox, Fieldset, TextField } from "react95";
import styled from "styled-components";
import { useTables } from "../../contexts/Tables";
import { useApi } from "../../utils/useApi";

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.7rem 1rem;
`;

const Description = styled.div`
  flex-basis: 8rem;
`;

export function CreateIndex() {
  const { currentTable } = useTables();
  const { executeQuery } = useApi();
  const [fieldsToIndex, setFieldsToIndex] = useState([]);

  useEffect(() => {
    setFieldsToIndex([]);
  }, [currentTable?.name]);

  const toggleFieldToIndex = (name) => {
    if (fieldsToIndex.includes(name)) {
      setFieldsToIndex(
        fieldsToIndex.filter((currentName) => currentName !== name)
      );
    } else {
      setFieldsToIndex([...fieldsToIndex, name]);
    }
  };

  return (
    <Fieldset label="Create index">
      <FlexRow>
        <Description>Name</Description>
        <TextField style={{ width: 300 }} />
      </FlexRow>
      <FlexRow>
        <Description>Fields</Description>
        <div>
          {currentTable.structure.map((field) => (
            <Button
              key={field.name}
              style={{ marginRight: 3 }}
              active={fieldsToIndex.includes(field.name)}
              onClick={() => toggleFieldToIndex(field.name)}
            >
              {field.name}
            </Button>
          ))}
        </div>
      </FlexRow>
      <FlexRow>
        <Description>Unique</Description>
        <Checkbox />
      </FlexRow>
      <FlexRow>
        <Button>Create index</Button>
      </FlexRow>
    </Fieldset>
  );
}

// CREATE [UNIQUE] INDEX idx_contacts_name ON contacts(first_name, last_name);
