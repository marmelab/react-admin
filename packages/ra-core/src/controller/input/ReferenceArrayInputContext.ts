import { createContext } from 'react';
import { PaginationPayload, RaRecord, SortPayload } from '../../types';

/**
 * Context which provides access to the useReferenceArrayInput features.
 *
 * @example
 * const ReferenceArrayInput = ({ children }) => {
 *     const controllerProps = useReferenceArrayInputController();
 *     return (
 *         <ReferenceArrayInputContextProvider value={controllerProps}>
 *             {children}
 *         </ReferenceArrayInputContextProvider>
 *     )
 * }
 */
export const ReferenceArrayInputContext = createContext(undefined);

export interface ReferenceArrayInputContextValue<
    RaRecordType extends RaRecord = any
> {
    choices: RaRecordType[];
    error?: any;
    warning?: any;
    isLoading?: boolean;
    isFetching?: boolean;
    setFilter: (filter: any) => void;
    setPagination: (pagination: PaginationPayload) => void;
    setSort: (sort: SortPayload) => void;
}
