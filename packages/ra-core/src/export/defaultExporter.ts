import jsonExport from 'jsonexport/dist/index.js';

import { downloadCSV } from './downloadCSV';
import { Exporter } from '../types';

export const defaultExporter: Exporter = (data, _, __, resource) =>
    jsonExport(data, (err, csv) => downloadCSV(csv, resource));
