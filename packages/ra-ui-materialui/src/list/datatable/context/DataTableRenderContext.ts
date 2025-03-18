import { createContext, useContext } from 'react';

export type RenderContextType = 'data' | 'header' | 'columnsSelector';

export const DataTableRenderContext = createContext<RenderContextType>('data');

export const useDataTableRenderContext = () =>
    useContext(DataTableRenderContext);
