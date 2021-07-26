import isValid from 'date-fns/is_valid';
import parseDate from 'date-fns/parse';

export const isNumeric = (value: any) =>
    !isNaN(parseFloat(value)) && isFinite(value);
export const valuesAreNumeric = (values: any[]) => values.every(isNumeric);

export const isInteger = (value: any) =>
    Number.isInteger(value) || !isNaN(parseInt(value));
export const valuesAreInteger = (values: any[]) => values.every(isInteger);

export const isBoolean = (value: any) => typeof value === 'boolean';
export const valuesAreBoolean = (values: any[]) => values.every(isBoolean);

export const isBooleanString = (value: any) =>
    ['true', 'false'].includes(value.toString().toLowerCase());
export const valuesAreBooleanString = (values: any[]) =>
    values.every(isBooleanString);

export const isString = (value: any) => typeof value === 'string';
export const valuesAreString = (values: any[]) => values.every(isString);

const HtmlRegexp = /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/i;
export const isHtml = (value: any) => !value || HtmlRegexp.test(value);
export const valuesAreHtml = (values: any[]) => values.every(isHtml);

const UrlRegexp = /http(s*):\/\/.*/i;
export const isUrl = (value: any) => !value || UrlRegexp.test(value);
export const valuesAreUrl = (values: any[]) => values.every(isUrl);

const ImageUrlRegexp = /http(s*):\/\/.*\.(jpeg|jpg|jfif|pjpeg|pjp|png|svg|gif|webp|apng|bmp|ico|cur|tif|tiff)/i;
export const isImageUrl = (value: any) => !value || ImageUrlRegexp.test(value);
export const valuesAreImageUrl = (values: any[]) => values.every(isImageUrl);

// This is a very simple regex to find emails
// It it NOT meant to validate emails as the spec is way more complicated but is
// enough for our inference needs
const EmailRegexp = /@{1}/;
export const isEmail = (value: any) => !value || EmailRegexp.test(value);
export const valuesAreEmail = (values: any[]) => values.every(isEmail);

export const isArray = (value: any) => Array.isArray(value);
export const valuesAreArray = (values: any[]) => values.every(isArray);

export const isDate = (value: any) => !value || value instanceof Date;
export const valuesAreDate = (values: any[]) => values.every(isDate);

export const isDateString = (value: any) =>
    !value || (typeof value === 'string' && isValid(parseDate(value)));
export const valuesAreDateString = (values: any[]) =>
    values.every(isDateString);

export const isObject = (value: any) =>
    Object.prototype.toString.call(value) === '[object Object]';
export const valuesAreObject = (values: any[]) => values.every(isObject);
