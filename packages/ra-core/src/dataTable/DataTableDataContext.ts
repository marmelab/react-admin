import { createContext, useContext } from 'react';
import { type RaRecord } from '../types';

export type DataTableDataContextProps<RecordType extends RaRecord = any> =
    | RecordType[]
    | undefined;

export const DataTableDataContext =
    createContext<DataTableDataContextProps>(undefined);

export const useDataTableDataContext = <RecordType extends RaRecord = any>() =>
    useContext(DataTableDataContext) as DataTableDataContextProps<RecordType>;
