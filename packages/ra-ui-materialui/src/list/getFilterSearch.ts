// Only the characters that the list can't read back are percent-encoded
// ("%", "&" and "+" for query-string, "#" for react-router), so that the URL stays readable
export const getFilterSearch = (filter: object) =>
    `filter=${JSON.stringify(filter).replace(/[%&#+]/g, encodeURIComponent)}`;
