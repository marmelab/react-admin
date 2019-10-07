import parseDate from 'date-fns/parse';

export const isNumeric = (value: any) =>
    !isNaN(parseFloat(value)) && isFinite(value);
export const valuesAreNumeric = (values: any[]) => values.every(isNumeric);

export const isInteger = (value: any) => Number.isInteger(value);
export const valuesAreInteger = (values: any[]) => values.every(isInteger);

export const isBoolean = (value: any) => typeof value === 'boolean';
export const valuesAreBoolean = (values: any[]) => values.every(isBoolean);

export const isString = (value: any) => typeof value === 'string';
export const valuesAreString = (values: any[]) => values.every(isString);

const HtmlRegexp = /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/i;
export const isHtml = (value: any) => HtmlRegexp.test(value);
export const valuesAreHtml = (values: any[]) => values.every(isHtml);

export const isArray = (value: any) => Array.isArray(value);
export const valuesAreArray = (values: any[]) => values.every(isArray);

export const isDate = (value: any) => value instanceof Date;
export const valuesAreDate = (values: any[]) => values.every(isDate);

export const isDateString = (value: any) =>
    typeof value === 'string' && !isNaN(parseDate(value).getDate());
export const valuesAreDateString = (values: any[]) =>
    values.every(isDateString);

export const isObject = (value: any) =>
    Object.prototype.toString.call(value) === '[object Object]';
export const valuesAreObject = (values: any[]) => values.every(isObject);
