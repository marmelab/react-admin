import parseDate from 'date-fns/parse';

export const isNumeric = value => !isNaN(parseFloat(value)) && isFinite(value);
export const valuesAreNumeric = values => values.every(isNumeric);

export const isInteger = value => Number.isInteger(value);
export const valuesAreInteger = values => values.every(isInteger);

export const isBoolean = value => typeof value === 'boolean';
export const valuesAreBoolean = values => values.every(isBoolean);

export const isString = value => typeof value === 'string';
export const valuesAreString = values => values.every(isString);

const HtmlRegexp = /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/i;
export const isHtml = value => HtmlRegexp.test(value);
export const valuesAreHtml = values => values.every(isHtml);

export const isArray = value => Array.isArray(value);
export const valuesAreArray = values => values.every(isArray);

export const isDate = value => value instanceof Date;
export const valuesAreDate = values => values.every(isDate);

export const isDateString = value =>
    typeof value === 'string' && !isNaN(parseDate(value));
export const valuesAreDateString = values => values.every(isDateString);

export const isObject = value =>
    Object.prototype.toString.call(value) === '[object Object]';
export const valuesAreObject = values => values.every(isObject);
