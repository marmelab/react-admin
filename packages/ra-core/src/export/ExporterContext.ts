import { createContext } from 'react';

import { Exporter } from '../types';
import { defaultExporter } from './defaultExporter';

export const ExporterContext = createContext<Exporter | false>(defaultExporter);

ExporterContext.displayName = 'ExporterContext';
