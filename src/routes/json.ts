// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanitizeJson(json: any): any {
  const type = typeof json;

  if (json === null) {
    return json;
  }

  if (type === 'bigint') {
    return json.toString();
  }

  if (type === 'object' && Array.isArray(json)) {
    return json.map(sanitizeJson);
  }

  if (type === 'object') {
    return Object.keys(json).reduce((previous, current) => {
      return { ...previous, [current]: sanitizeJson(json[current]) };
    }, {});
  }

  return json;
}
