import { useDatabase } from "../contexts/Database";
import { useErrorModal } from "../contexts/ErrorModal";

function coolFetch(url, params, database = "") {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Database: database,
    },
    body: JSON.stringify(params),
  }).then((res) => res.json());
}

export function useApi() {
  const { open } = useErrorModal();
  const { database } = useDatabase();

  const fetch = (route, payload) => {
    return coolFetch(route, payload, database);
  };

  const executeQuery = async (query, params) => {
    const data = await coolFetch("api/sql", { query, params }, database);

    if (data.error) {
      open("SQL error!", data.error);
      return Promise.reject();
    }

    return data;
  };

  return { fetch, executeQuery };
}
