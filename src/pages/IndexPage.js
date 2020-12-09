import React, { useState } from "react";
import styled from "styled-components";

import { Layout } from "../components/Layout";
import { coolFetch } from "../utils/coolFetch";

const Submit = styled.button`
  border: 3px solid grey;
`;

export function IndexPage() {
  const [value, setValue] = useState("SELECT * FROM `players`;");
  const [response, setResponse] = useState("...");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const execute = async () => {
    const data = await coolFetch("api/sql", { sql: value });
    setResponse(data);
  };

  return (
    <Layout>
      <textarea rows="10" cols="50" onChange={onChange} value={value} />

      <div>
        <Submit onClick={execute}>Execute</Submit>
      </div>

      <pre>{JSON.stringify(response, null, 2)}</pre>
    </Layout>
  );
}
