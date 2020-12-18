import { useDatabase } from "../contexts/Database";
import { useErrorModal } from "../contexts/ErrorModal";

function fetchSqliteApi({ url, params, database = "" }) {
  return fetch(`${process.env.basePath}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Database: database,
    },
    body: JSON.stringify(params),
  }).then((response) => response.json());
}

export function useApi() {
  const { open } = useErrorModal();
  const { database } = useDatabase();

  const fetch = async (url, params) => {
    const response = await fetchSqliteApi({ url, params, database });

    if (response.error) {
      open(response.error.title || "Error!", response.error.message);
      return Promise.reject();
    }

    return response;
  };

  const executeQuery = async (query, params) => {
    return fetch("api/sql", { query, params });
  };

  return { fetch, executeQuery };
}
