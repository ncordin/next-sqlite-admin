import React from "react";
import { Fieldset } from "react95";
import { Centred } from "../components/Centred";

export function EmptyTab() {
  return (
    <Centred>
      <Fieldset label="Oups!" style={{ padding: 64 }}>
        <Centred>This table has been deleted.</Centred>
      </Fieldset>
    </Centred>
  );
}
