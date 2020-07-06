import { createContext } from 'react';

import { Exporter } from '../types';
import defaultExporter from './defaultExporter';

const ExporterContext = createContext<Exporter | false>(defaultExporter);

ExporterContext.displayName = 'ExporterContext';

export default ExporterContext;
