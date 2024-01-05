import { useDatabase } from '../contexts/Database';
import { useErrorModal } from '../contexts/ErrorModal';

const BASE_URL = './';

function fetchSqliteApi({ url, params, database = '' }) {
  return fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
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
      open(response.error.title || 'Error!', response.error.message);
      return Promise.reject();
    }

    return response;
  };

  const executeQuery = async (query, params) => {
    return fetch('api/sql', { query, params });
  };

  return { fetch, executeQuery };
}
