import { useEffect, useState } from 'react';

export function useUrlParam(name, defaultValue) {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(name) || defaultValue;
  const [val, setVal] = useState(value);

  useEffect(() => {
    window.addEventListener('popstate', () => {
      const params = new URLSearchParams(window.location.search);
      const value = params.get(name);
      setVal(value);
    });

    if (params.has(name) === false && defaultValue) {
      setValue(defaultValue);
    }
  }, []);

  function setValue(value) {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set(name, value);
    } else {
      url.searchParams.delete(name);
    }
    window.history.pushState(
      'What is that data?',
      'What is this title?',
      url.toString()
    );
    window.dispatchEvent(new Event('popstate'));
  }

  return [val, setValue];
}
