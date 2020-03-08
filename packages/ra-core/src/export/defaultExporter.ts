import jsonExport from 'jsonexport/dist';

import downloadCSV from './downloadCSV';
import { Exporter } from '../types';

const defaultExporter: Exporter = (data, _, __, resource) =>
    jsonExport(data, (err, csv) => downloadCSV(csv, resource));

export default defaultExporter;
