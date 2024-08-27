import jsonExport from 'jsonexport/dist';

import { downloadCSV } from './downloadCSV';
import { Exporter } from '../types';

export const defaultExporter: Exporter = (data, _, __, resource) => {
    return jsonExport(data, (err, csv) => downloadCSV(csv, resource));
};
