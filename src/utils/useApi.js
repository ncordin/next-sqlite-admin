import { useErrorModal } from "../contexts/ErrorModal";

function coolFetch(url, params) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }).then((res) => res.json());
}

export function useApi() {
  const { open } = useErrorModal();

  const fetch = (route, payload) => {
    return coolFetch(route, payload);
  };

  const executeQuery = async (query) => {
    const data = await coolFetch("api/sql", { sql: query });

    if (data.error) {
      open("SQL error!", data.error);
      return Promise.reject();
    }

    return data;
  };

  return { fetch, executeQuery };
}
