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

// With forceTextDelimiter, jsonexport wraps the headers in quotes before
// calling mapHeaders, without escaping the quotes they contain
const escapeHeader = (header: string) =>
    `"${escapeFormula(header.slice(1, -1)).replace(/"/g, '""')}"`;

export const defaultExporter: Exporter = (data, _, __, resource) =>
    jsonExport(
        data,
        {
            typeHandlers: { String: escapeFormula },
            mapHeaders: escapeHeader,
            // spreadsheets using another separator (e.g. ; in some locales)
            // would otherwise split cells inside unquoted values
            forceTextDelimiter: true,
        },
        (err, csv) => downloadCSV(csv, resource)
    );
