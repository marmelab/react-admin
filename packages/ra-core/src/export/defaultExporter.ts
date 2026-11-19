import jsonExport from 'jsonexport/dist/index.js';

import { downloadCSV } from './downloadCSV';
import { Exporter } from '../types';

// Spreadsheets read a cell starting with one of these characters as a formula,
// so it is prefixed with a single quote to be displayed as text.
// Signed numbers are kept as is.
const escapeFormula = (value: string) =>
    /^[=+\-@\t\r]/.test(value) && !/^[+-]?\d+([.,]\d+)?$/.test(value)
        ? `'${value}`
        : value;

// jsonexport doesn't quote a value with a lone \r, which spreadsheets read as
// a line break
const escapeValue = (value: string) =>
    escapeFormula(value).replace(/\r(?!\n)/g, '\n');

// jsonexport doesn't quote the headers, which come from the record keys
const escapeHeader = (header: string) => {
    const text = escapeFormula(header);
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const defaultExporter: Exporter = (data, _, __, resource) =>
    jsonExport(
        data,
        { typeHandlers: { String: escapeValue }, mapHeaders: escapeHeader },
        (err, csv) => downloadCSV(csv, resource)
    );
