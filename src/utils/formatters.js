export const formatQuery = (queries) => {
  if (!queries) return '';
  const keys = Object.keys(queries);
  const queryParams = [];

  keys.forEach((key) => {
    const query = queries[key];
    if (query === null || query === undefined) return;
    if (Array.isArray(query)) {
      queryParams.push(`${key}=${query.join(',')}`);
    } else if (typeof query === 'object') {
      const subKeys = Object.keys(query);
      let queryValue = [];
      subKeys.forEach((subKey) => {
        queryValue.push(`${subKey}:${query[subKey]}`);
      });
      queryParams.push(`${key}=${queryValue.join(',')}`);
    } else {
      queryParams.push(`${key}=${query}`);
    }
  });

  return queryParams.join('&');
};

export function ObjectFormatter(productsSoldByShops) {
  return Object.entries(productsSoldByShops).map(([store, value]) => ({
    store,
    value,
  }));
}
