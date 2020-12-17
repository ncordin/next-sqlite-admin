import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableDataCell, TableRow } from "react95";
import styled from "styled-components";
import { ClosableWindow } from "../components/ClosableWindow";
import { useApi } from "../utils/useApi";

const Container = styled.div`
  padding: 1rem;
`;

const isDatabase = (name) => name.endsWith(".db");

export function ExploreScreen({ selectDatabase, onClose }) {
  const [path, setPath] = useState(null);
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const { fetch } = useApi();

  useEffect(() => {
    fetch("api/files", { path }).then((response) => {
      if (response.path) {
        setPath(response.path);
        setDirectories(response.directories);
        setFiles(response.files);
      }
    });
  }, [path]);

  const up = () => {
    setPath(path.split("/").slice(0, -1).join("/"));
  };

  return (
    <Container>
      <ClosableWindow title={path} onClose={onClose} style={{ width: "70%" }}>
        <Table>
          <TableBody>
            <TableRow onClick={up}>
              <TableDataCell style={{ cursor: "pointer" }}>..</TableDataCell>
            </TableRow>
            {directories.map((file, index) => (
              <TableRow key={index} onClick={() => setPath(`${path}/${file}`)}>
                <TableDataCell
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                >
                  {file}/
                </TableDataCell>
              </TableRow>
            ))}
            {files.map((file, index) => (
              <TableRow key={index}>
                <TableDataCell>
                  {isDatabase(file) ? (
                    <div
                      onClick={() => selectDatabase(`${path}/${file}`)}
                      style={{
                        fontWeight: "bold",
                        cursor: "pointer",
                        display: "flex",
                      }}
                    >
                      <Image src="/database.png" width={24} height={24} />{" "}
                      {file}
                    </div>
                  ) : (
                    <span style={{ opacity: 0.2 }}>{file}</span>
                  )}
                </TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ClosableWindow>
    </Container>
  );
}
