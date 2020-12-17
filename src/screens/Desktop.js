import React, { useState } from "react";

import { MainScreen } from "../screens/MainScreen";
import { ExploreScreen } from "../screens/ExploreScreen";
import { Shortcut } from "../components/Shortcut";
import { useDatabase } from "../contexts/Database";

export function Desktop() {
  const { database, setDatabase } = useDatabase();
  const [databases, setDatabases] = useState([]);
  const [path, setPath] = useState(null);

  return (
    <>
      {database && <MainScreen onClose={() => setDatabase(null)} />}

      {path && (
        <ExploreScreen
          selectDatabase={(file) => {
            !databases.includes(file) && setDatabases([...databases, file]);
            setPath(null);
          }}
          onClose={() => setPath(null)}
        />
      )}

      {!database && !path && (
        <>
          <Shortcut
            icon="computer"
            name="Explore"
            onClick={() => setPath(".")}
          />
          {databases.map((file) => (
            <Shortcut
              key={file}
              icon="database"
              name={file.split("/").slice(-1).join("")}
              onClick={() => setDatabase(file)}
            />
          ))}
        </>
      )}
    </>
  );
}
